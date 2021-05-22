import Cookies from 'cookies'
import HandleAuth from '../../../services/auth';
import bcrypt from 'bcryptjs'
import DbConnect, { Post, Category, User } from "./../../../database/connection"

interface postListParams {
    perPage?: any,
    page?: any,
    search?: any,
    select?: any,
    category?: any,
    ne?: any,
    random?: any,
    author?: any,
    UA?: any,
    beforeDate?: Date;
    afterDate?: Date;
}

export const listPosts = async (params: postListParams) => {
    let { perPage, page, search, select, category, ne, random, author, beforeDate, afterDate, UA } = params
    const rgx = (pattern) => (new RegExp(`.*${pattern}.*`));
    perPage = Number(perPage)
    page = Number(page)

    if (random) {
        let posts = await Post.aggregate([{ $sample: { size: perPage + 1 } }, { $match: { publishDate: { $lte: new Date() } } }])
        posts = posts.filter(p => ne !== p.link).filter((p, i) => i < perPage)
        return {
            result: posts.map(post => { return { image: post.image, link: post.link, title: post.title, description: post.description } })
        }
    } else {
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
            `${select} ${UA?.username ? "" : "-_id"}`,
            { skip: perPage * (((page >= 1) ? page : 1) - 1), limit: perPage, sort: { publishDate: -1 } })
            .collation({ locale: "en", strength: 2 }).exec()

        let count: any = await Post.find(
            objFind,
            `${select} ${UA?.username ? "" : "-_id"}`,
            {}).collation({ locale: "en", strength: 2 }).countDocuments({}).exec()


        return {
            result: posts.map(post => { return { image: post.image, link: post.link, title: post.title, description: post.description } }),
            count,
            perPage,
            page,
            pages: count % perPage > 0 ? Math.floor(count / perPage) + 1 : Math.floor(count / perPage)
        }
    }
}

async function handler(req, res) {
    await DbConnect()

    const cookies = new Cookies(req, res)
    let UA = await HandleAuth(cookies.get("auth"))
    let UAADMIN = bcrypt.compareSync(`${process.env.ADMINPASSWORD}_${process.env.ADMINUSERNAME}`, (cookies.get('AdminAreaAuth') || ""))

    let { perPage, page, search, select, category, ne, random, author, beforeDate, afterDate, authenticate } = req.query

    if (!authenticate) {
        beforeDate = (new Date(beforeDate) > new Date()) || !beforeDate ? new Date() : new Date(beforeDate)
        afterDate = (new Date(afterDate) > new Date()) || !afterDate ? new Date() : new Date(afterDate)
    } else {
        if (UA?._id) {
            author = UA?._id
        } else if (!UAADMIN) {
            author = ''
            beforeDate = (new Date(beforeDate) > new Date()) || !beforeDate ? new Date() : new Date(beforeDate)
            afterDate = (new Date(afterDate) > new Date()) || !afterDate ? new Date() : new Date(afterDate)
        }
    }
    category = await Category.findOne({ name: category }).exec()
    category = category?._id || ""

    res.status(200).json(await listPosts({ perPage, page, search, select, category, ne, random, author, UA, beforeDate, afterDate }))
}


export default handler