import Cookies from 'cookies'
import HandleAuth from "../../../services/auth"
import { Post, Category, User } from "../../../database/models";
import DbConnect from './../../../utils/dbConnect'
import sharp from 'sharp';
import formidable from 'formidable';
import imgbbUploader from 'imgbb-uploader';
import validator from 'validator'
import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const form = new formidable.IncomingForm()
    const cookies = new Cookies(req, res)

    await form.parse(req, async (err, fields, files) => {
        let warnings = []
        let post
        // let _id = fields?._id
        // let image = ""
        // let content = fields?.content
        // let title = fields?.title
        // let category = fields?.category
        // let description = fields?.description
        // let publishDate = fields?.publishDate
        // let link = fields?.link

        let image = ""
        let { _id, content, requestAs, author, title, category, description, publishDate, link } = fields
        console.log(fields)
        console.log(author)
        // return ""

        await DbConnect()

        switch (requestAs) {
            case "AdminArea":
                author = (await User.findOne({ username: author }).select('-password _id -__v').exec()).toJSON()._id
                break;
            default:
                let UA = await HandleAuth(cookies.get("auth"))
                if (!UA?.username)
                    warnings.push({ message: "Você não está autenticado.", input: "" })
                author = UA._id
                break;
        }

        if (warnings?.length <= 0) {
            if (req.method === "POST" || req.method === "PUT") {
                if (files?.image?.path) {
                    let base64string = (await sharp(files.image?.path).webp().toBuffer()).toString('base64')
                    const options = { apiKey: "d11615f1d7ecafdc0230d615378e4eee", base64string };
                    image = await imgbbUploader(options).then((response) => response?.url).catch((error) => console.error(error));
                } else {
                    image = fields?.image
                }

                category = (await Category.findOne({ name: category || "" }).exec())?._id || ""
            }



            switch (req.method) {
                case "GET":
                    post = await Post.findOne({ link: req.query?.link }).select("content publishDate image link description title category author _id").collation({ locale: "en", strength: 1 }).exec()
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
                    post = await Post.find({ link: req.query?.link }).remove().exec();
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