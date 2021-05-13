import HandleAuth from "../../../services/auth"
import Cookies from 'cookies'
import DbConnect, { Category } from "./../../../database/connection"

async function handler(req, res) {
    const cookies = new Cookies(req, res)
    let UA = await HandleAuth(cookies.get("auth"))

    await DbConnect()
    const { _id, name, color } = req.body

    if (UA?.username) {
        switch (req.method) {
            case "GET":
                let categoryGet = await Category.find({}).collation({ locale: "en", strength: 1 }).exec()
                res.status(200).json({ result: categoryGet })
                break;
            case "POST":
                let categoryPost = await (new Category({ name, color })).save();
                res.status(200).json({ result: categoryPost })
                break;
            case "PUT":
                let categoryPut = await Category.findOneAndUpdate({ _id }, { name, color }).exec();
                res.status(200).json({ result: categoryPut })
                break;
            case "DELETE":
                let categoryDelete = await Category.find({ _id: req.query?._id }).remove().exec();
                res.status(200).json({ result: categoryDelete })
                break;
            default:
                res.status(200).json({})
                break;
        }
    }
    else {
        res.status(200).json({})
    }
}

export default handler