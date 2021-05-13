import HandleAuth from "../../../services/auth";
import Cookies from 'cookies'
import DbConnect, { Category } from "./../../../database/connection"

async function handler(req, res) {
    await DbConnect()
    const rgx = (pattern) => (new RegExp(`.*${pattern}.*`));

    let { perPage, page, search } = req.query

    const cookies = new Cookies(req, res)
    let UA = await HandleAuth(cookies.get("auth"))

    perPage = Number(perPage)
    page = Number(page)

    let category: any = Category
    let count: any = Category

    if (search) {
        category = category.find({ name: { $regex: rgx(search), $options: "i" } }).collation({ locale: "en", strength: 2 })
        count = count.find({ name: { $regex: rgx(search), $options: "i" } }).collation({ locale: "en", strength: 2 })
    } else {
        category = category.find({})
        count = count.find({})
    }
    category = category.select(`${UA?.username ? "" : "-_id"}`)
    count = count.select(`${UA?.username ? "" : "-_id"}`)

    count = await count.countDocuments({}).exec()
    category = await category.skip(perPage * (((page >= 1) ? page : 1) - 1))
        .limit(perPage)
        .exec()

    res.status(200).json({
        result: category,
        count,
        perPage,
        page,
        pages: count % perPage > 0 ? Math.floor(count / perPage) + 1 : Math.floor(count / perPage)
    })
}

export default handler