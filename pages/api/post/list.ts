import Cookies from 'cookies'
import HandleAuth from '../../../services/auth';
import bcrypt from 'bcryptjs'
import { Post, Category, User } from "../../../database/models"
import DbConnect from './../../../utils/dbConnect'

interface postListParams {
    perPage?: any,
    page?: any,
    search?: any,
    select?: any,
    category?: any,
    ne?: any,
    author?: any,
    beforeDate?: Date;
    afterDate?: Date;
}

export const listPosts = async (params: postListParams) => {
    let { perPage, page, search, select, category, ne, author, beforeDate, afterDate } = params
    const rgx = (pattern) => (new RegExp(`.*${pattern}.*`));
    perPage = Number(perPage)
    page = Number(page)

    let objFind = {}

    if (beforeDate)
        objFind = { ...objFind, publishDate: { $lte: beforeDate } }

    if (afterDate < beforeDate && afterDate)
        objFind = { ...objFind, publishDate: { $gte: afterDate } }

    if (ne)
        objFind = { ...objFind, link: { $ne: ne } }

    if (search)
        objFind = {
            ...objFind,
            $or: [{ title: { $regex: rgx(search), $options: "i" } },
            { description: { $regex: rgx(search), $options: "i" } }]
        }

    if (category)
        objFind = { ...objFind, category: category }

    if (author)
        objFind = author ? { ...objFind, author: author } : objFind

    let posts: any = await Post.find(
        objFind,
        `${select}`,
        { skip: perPage * (((page >= 1) ? page : 1) - 1), limit: perPage, sort: { publishDate: -1 } })
        .collation({ locale: "en", strength: 2 }).exec()

    let count: any = await Post.find(
        objFind,
        `${select}`,
        {}).collation({ locale: "en", strength: 2 }).countDocuments({}).exec()


    return {
        result: posts.map(post => { return { image: post.image, link: post.link, title: post.title, description: post.description } }),
        count,
        perPage,
        page,
        pages: count % perPage > 0 ? Math.floor(count / perPage) + 1 : Math.floor(count / perPage)
    }
}

async function handler(req, res) {
    await DbConnect()
    const cookies = new Cookies(req, res)
    
    let { perPage, page, search, select, category, ne, author, beforeDate, afterDate } = req.query

    category = (await Category.findOne({ name: category }).exec())?._id

    let result = await listPosts({ perPage, page, search, select, category, ne, author, beforeDate, afterDate })

    res.status(200).json({ ...result })
}


export default handler