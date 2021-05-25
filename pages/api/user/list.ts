import bcrypt from 'bcryptjs'
import Cookies from 'cookies'
import { User } from "../../../database/models"
import DbConnect from './../../../utils/dbConnect'

async function handler(req, res) {
    await DbConnect()
    const rgx = (pattern) => (new RegExp(`.*${pattern}.*`));

    let { perPage, page, search } = req.query

    const cookies = new Cookies(req, res)
    let UA = bcrypt.compareSync(`${process.env.ADMINPASSWORD}_${process.env.ADMINUSERNAME}`, (cookies.get('AdminAreaAuth') || ""))

    perPage = Number(perPage)
    page = Number(page)

    let user: any = User
    let count: any = User

    if (search) {
        user = user.find({ username: { $regex: rgx(search), $options: "i" } }).collation({ locale: "en", strength: 2 })
        count = count.find({ username: { $regex: rgx(search), $options: "i" } }).collation({ locale: "en", strength: 2 })
    } else {
        user = user.find({})
        count = count.find({})
    }
    user = user.select(`${UA ? "" : "-_id"}`)
    count = count.select(`${UA ? "" : "-_id"}`)

    count = await count.countDocuments({}).exec()
    user = await user.skip(perPage * (((page >= 1) ? page : 1) - 1))
        .limit(perPage)
        .exec()

    res.status(200).json({
        result: user,
        count,
        perPage,
        page,
        pages: count % perPage > 0 ? Math.floor(count / perPage) + 1 : Math.floor(count / perPage)
    })
}

export default handler