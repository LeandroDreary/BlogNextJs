import Cookies from 'cookies'
import HandleAuth from '../../../services/auth';
import DbConnect, { Post, Category, User } from "./../../../database/connection"

interface postListParams {
    perPage?: any,
    page?: any,
    search?: any,
    select?: any,
    category?: any,
    ne?: any,
    random?: any,
    authorFilter?: any,
    UA?: any,
    beforeDate?: Date;
    afterDate?: Date;
}

export const listPosts = async (params: postListParams) => {
    let { perPage, page, search, select, category, ne, random, authorFilter, beforeDate, afterDate, UA } = params
    const rgx = (pattern) => (new RegExp(`.*${pattern}.*`));

    perPage = Number(perPage)
    page = Number(page)
    authorFilter = Boolean(authorFilter) || false

    if (random) {
        let posts = await Post.aggregate([{ $sample: { size: perPage + 1 } }, { $match: { publishDate: { $lte: new Date() } } }])
        posts = posts.filter(p => ne !== p.link).filter((p, i) => i < perPage)
        return {
            result: posts.map(post => { return { image: post.image, link: post.link, title: post.title, description: post.description } })
        }
    } else {
        let objFind = {}

        if (beforeDate !== undefined)
            objFind = { ...objFind, publishDate: { $lte: beforeDate } }

        if (afterDate !== undefined)
            objFind = { ...objFind, publishDate: { $gte: afterDate } }

        if (ne !== undefined)
            objFind = { ...objFind, link: { $ne: ne } }

        console.log(search)
        if (search !== undefined)
            objFind = {
                ...objFind, $and: {
                    $or: [{ title: { $regex: rgx(search), $options: "i" } },
                    { description: { $regex: rgx(search), $options: "i" } }
                    ]
                }
            }

        if (category !== undefined)
            objFind = { ...objFind, category: category }

        if (authorFilter !== undefined) {
            authorFilter = await User.findOne({ _id: UA?._id }).exec() || false
            objFind = authorFilter ? { ...objFind, author: authorFilter?._id } : objFind
        }

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

    let { perPage, page, search, select, category, ne, random, authorFilter, beforeDate, afterDate } = req.query

    res.status(200).json(await listPosts({ perPage, page, search, select, category, ne, random, authorFilter, UA, beforeDate, afterDate }))
}


export default handler