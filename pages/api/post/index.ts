import Cookies from 'cookies'
import HandleAuth from "../../../services/auth"
import type { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp';
import formidable from 'formidable';
import imgbbUploader from 'imgbb-uploader';
import bcrypt from 'bcryptjs'
import DbConnect from './../../../utils/dbConnect'
import { Post, Category, User } from "../../../database/models";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const form = new formidable.IncomingForm()
    const cookies = new Cookies(req, res)

    await form.parse(req, async (err, fields, files) => {
        let warnings = []
        let post

        let image = ""
        let { _id, content, requestAs, author, title, category, description, publishDate, link } = fields
        await DbConnect()

        if (req.method === "POST" || req.method === "PUT" || req.method === "DELETE") {
            switch (requestAs) {
                case "AdminArea":
                    if (bcrypt.compareSync(`${process.env.ADMINPASSWORD}_${process.env.ADMINUSERNAME}`, cookies.get('AdminAreaAuth') || "")) {
                        author = (await User.findOne({ username: author }).select('-password _id -__v').exec()).toJSON()._id
                    } else {
                        warnings.push({ message: "Você não está logado.", type: 'error', input: "" })
                    }
                    break;
                case "admin":
                    let UA = await HandleAuth(cookies.get("auth"))
                    let post1 = await Post.findOne(_id).exec()
                    if (UA?.username) {
                        if (UA?._id === post1?.author) {
                            author = UA._id
                        } else {
                            warnings.push({ message: "Você não possui permissões sobre essa postagem.", input: "" })
                        }
                    } else {
                        warnings.push({ message: "Você não está autenticado.", input: "" })
                    }
                    break;
                default:
                    warnings.push({ message: "Você está esquecendo de algo.", input: "" })
                    break;
            }

            if ((req.method === "POST" || req.method === "PUT") && warnings?.length <= 0) {
                if (files?.image?.path) {
                    let base64string = (await sharp(files.image?.path).webp().toBuffer()).toString('base64')
                    const options = { apiKey: process.env.IMGBB_APIKEY, base64string };
                    image = await imgbbUploader(options).then((response) => response?.url).catch((error) => console.error(error));
                } else {
                    image = fields?.image
                }

                category = (await Category.findOne({ name: category || "" }).exec())?._id || ""
            }
        }


        if (warnings?.length <= 0) {
            switch (req.method) {
                case "GET":
                    post = await Post.findOne({ link: String(req.query?.link) }).select("content publishDate image link description title category author _id").collation({ locale: "en", strength: 1 }).exec()
                    post = {
                        ...post.toJSON(),
                        category: (await Category.findOne({ _id: post?.category }).select("name -_id").exec()).toJSON().name,
                        author: (await User.findOne({ _id: post?.author }).select("username -_id").exec()).toJSON().username
                    }
                    break;
                case "POST":
                    post = await (new Post({ content, title, category, description, publishDate, author, image, link })).save();
                    break;
                case "PUT":
                    post = await Post.findOneAndUpdate({ _id }, { content, title, category, description, publishDate, author, image, link: encodeURI(link) }).exec();
                    break;
                case "DELETE":
                    post = await Post.find({ link: String(req.query?.link) }).remove().exec();
                    break;
                default:
                    break;
            }
        }
        res.status(200).json({ result: post, warnings })
    })
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export default handler