import bcrypt from 'bcryptjs'
import Cookies from 'cookies'
import { Category } from "../../../database/models"
import DbConnect from './../../../utils/dbConnect'

interface ListCategoriesParams {
    perPage?: any,
    page?: any,
    search?: any,
    UA?: any,
    select?: string
}

export const ListCategories = async (params: ListCategoriesParams) => {
    let { perPage, page, search, select } = params

    const rgx = (pattern) => (new RegExp(`.*${pattern}.*`));

    perPage = Number(perPage)
    page = Number(page)

    let categories
    let count

    if (search) {
        categories = Category.find({ name: { $regex: rgx(search), $options: "i" } }).collation({ locale: "en", strength: 2 })
        count = Category.find({ name: { $regex: rgx(search), $options: "i" } }).collation({ locale: "en", strength: 2 })
    } else {
        categories = Category.find({})
        count = Category.find({})
    }

    count = await count.countDocuments({}).exec()
    categories = await categories.skip(perPage * (((page >= 1) ? page : 1) - 1))
        .limit(perPage)
        .select(select)
        .exec()

    return {
        result: categories.map(category => category.toJSON()),
        count,
        perPage,
        page,
        pages: count % perPage > 0 ? Math.floor(count / perPage) + 1 : Math.floor(count / perPage)
    }
}

async function handler(req, res) {
    await DbConnect()

    let { perPage, page, search, select } = req.query

    const cookies = new Cookies(req, res)

    let UA = bcrypt.compareSync(`${process.env.ADMINPASSWORD}_${process.env.ADMINUSERNAME}`, (cookies.get('AdminAreaAuth') || ""))

    if(!UA) select += " -_id"

    res.status(200).json(await ListCategories({ perPage, page, search, UA, select }))
}

export default handler