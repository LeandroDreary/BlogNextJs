import bcrypt from 'bcryptjs'
import Cookies from 'cookies'
import { Category } from "../../../database/models"
import DbConnect from './../../../utils/dbConnect'

async function handler(req, res) {
    const cookies = new Cookies(req, res)

    await DbConnect()
    const { _id, name, color } = req.body
    let category: any

    if (bcrypt.compareSync(`${process.env.ADMINPASSWORD}_${process.env.ADMINUSERNAME}`, (cookies.get('AdminAreaAuth') || ""))) {
        switch (req.method) {
            case "GET":
                category = await Category.findOne({}).collation({ locale: "en", strength: 1 }).exec()
                break;
            case "POST":
                category = await (new Category({ name, color })).save();
                break;
            case "PUT":
                category = await Category.findOneAndUpdate({ _id }, { name, color }).exec();
                break;
            case "DELETE":
                category = await Category.find({ _id: req.query?._id }).remove().exec();
                break;
            default:
                res.status(200).json({})
                break;
        }
        res.status(200).json({ result: category })
    }
    else {
        res.status(200).json({})
    }
}

export default handler