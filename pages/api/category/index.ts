import { Category } from "../../../database/models"
import { AdminAuthApi } from '../../../utils/authentication'
import DbConnect from './../../../utils/dbConnect'

async function handler(req, res) {

    await DbConnect()
    const { _id, name, color, link } = req.body

    // user Authentication
    let UAADM = await AdminAuthApi({ req, res }, ({ user }) => user)

    let category: any
    if (UAADM) {
        switch (req.method) {
            case "GET":
                category = await Category.findOne({}).collation({ locale: "en", strength: 1 }).exec()
                break;
            case "POST":
                category = await (new Category({ name, color, link })).save();
                break;
            case "PUT":
                category = await Category.findOneAndUpdate({ _id }, { name, color, link }).exec();
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