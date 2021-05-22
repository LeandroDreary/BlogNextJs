import Cookies from 'cookies'
import HandleAuth from "../../../services/auth"
import DbConnect, { Post, Category } from "./../../../database/connection";
import sharp from 'sharp';
import formidable from 'formidable';
import imgbbUploader from 'imgbb-uploader';
import validator from 'validator'
import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const form = new formidable.IncomingForm()

    form.parse(req, async (err, fields, files) => {
        let warnings = []
        let post
        let { _id, image, content, title, category, description, publishDate, link } =
            { _id: fields?._id, image: "", content: fields?.content, title: fields?.title, category: fields?.category, description: fields?.description, publishDate: fields?.publishDate, link: fields?.link }

        const cookies = new Cookies(req, res)
        let UA = await HandleAuth(cookies.get("auth"))
        await DbConnect()

        if (!UA?.username)
            warnings.push({ message: "Você não está autenticado.", input: "" })

        if (warnings?.length <= 0) {

            if (req.method === "POST" || req.method === "PUT") {
                if (files?.image?.path) {
                    let base64string = (await sharp(files.image?.path).webp().toBuffer()).toString('base64')
                    const options = { apiKey: "d11615f1d7ecafdc0230d615378e4eee", base64string };
                    image = await imgbbUploader(options).then((response) => response?.url).catch((error) => console.error(error));
                } else {
                    image = fields?.image
                }
            }

            switch (req.method) {
                case "GET":
                    post = await Post.findOne({ link: req.query?.link }).collation({ locale: "en", strength: 1 }).exec()
                    post = { _id: post?._id, content: post?.content, publishDate: post?.publishDate, image: post?.image, link: post?.link, description: post?.description, title: post?.title, category: await Category.findOne({ _id: post?.category }).exec() }
                    break;
                case "POST":
                    category = (await Category.findOne({ name: category || "" }).exec())?._id || ""
                    post = await (new Post({ content, title, category, description, publishDate, author: UA._id, image, link })).save();
                    break;
                case "PUT":
                    category = (await Category.findOne({ name: category }).exec())?._id || ""
                    post = await Post.findOneAndUpdate({ _id }, { content, title, category, description, publishDate, author: UA._id, image, link: encodeURI(link) }).exec();
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