import bcrypt from 'bcryptjs'
import Cookies from 'cookies'
import DbConnect, { Category } from "./../../../database/connection"

interface ListCategoriesParams {
    perPage?: any,
    page?: any,
    search?: any,
    UA?: any
}

export const ListCategories = async (params: ListCategoriesParams) => {
    let { perPage, page, search, UA } = params

    const rgx = (pattern) => (new RegExp(`.*${pattern}.*`));

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
    category = category.select(`${UA ? "" : "-_id"}`)
    count = count.select(`${UA ? "" : "-_id"}`)

    count = await count.countDocuments({}).exec()
    category = await category.skip(perPage * (((page >= 1) ? page : 1) - 1))
        .limit(perPage)
        .exec()
    return {
        result: category.map(c => { return { color: c.color, name: c.name, _id: String(c._id) } }),
        count,
        perPage,
        page,
        pages: count % perPage > 0 ? Math.floor(count / perPage) + 1 : Math.floor(count / perPage)
    }
}

async function handler(req, res) {
    await DbConnect()

    let { perPage, page, search } = req.query

    const cookies = new Cookies(req, res)

    let UA = bcrypt.compareSync(`${process.env.ADMINPASSWORD}_${process.env.ADMINUSERNAME}`, (cookies.get('AdminAreaAuth') || ""))

    res.status(200).json(await ListCategories({ perPage, page, search, UA }))
}

export default handler