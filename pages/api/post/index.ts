import Mongoose from "mongoose"
import Cookies from 'cookies'
import HandleAuth from "../../../services/auth"
import DbConnect, { Post, Category, PostI } from "./../../../database/connection"

async function handler(req, res) {
    let { content, title, category, description, publishDate, image, link, _id } = req.body

    const cookies = new Cookies(req, res)
    let UA = await HandleAuth(cookies.get("auth"))
    
    await DbConnect()
    if (UA?.username) {
        switch (req.method) {
            case "GET":
                let postGet: Mongoose.Document & PostI = await Post.findOne({ link: req.query?.link }).collation({ locale: "en", strength: 1 }).exec()
                res.status(200).json({
                    result: {
                        _id: postGet?._id,
                        content: postGet?.content,
                        publishDate: postGet?.publishDate,
                        image: postGet?.image,
                        link: postGet?.link,
                        description: postGet?.description,
                        title: postGet?.title,
                        category: await Category.findOne({ _id: postGet?.category }).exec()
                    }
                })
                break;
            case "POST":
                category = (await Category.findOne({ name: category }).exec())?._id || ""
                let postPost = await (new Post({ content, title, category, description, publishDate, image, link })).save();
                res.status(200).json({ result: postPost })
                break;
            case "PUT":
                category = (await Category.findOne({ name: category }).exec())?._id || ""
                let postPut = await Post.findOneAndUpdate({ _id }, { content, title, category, description, publishDate, image, link: encodeURI(link) }).exec();
                res.status(200).json({ result: postPut })
                break;
            case "DELETE":
                let postDelete = await Post.find({ link: req.query?.link }).remove().exec();
                res.status(200).json({ result: postDelete })
                break;
            default:
                res.status(200).json({})
                break;
        }
    } else {
        res.status(200).json({})
    }
}

export default handler