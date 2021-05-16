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
    UA?: any
}

export const listPosts = async (params: postListParams) => {
    let { perPage, page, search, select, category, ne, random, authorFilter, UA } = params
    const rgx = (pattern) => (new RegExp(`.*${pattern}.*`));

    perPage = Number(perPage)
    page = Number(page)
    authorFilter = Boolean(authorFilter) || false

    if (random) {
        let posts = await Post.aggregate([{ $sample: { size: perPage + 1 } }])
        posts = posts.filter(p => ne !== p.link).filter((p, i) => i < perPage)
        return {
            result: posts.map(post => { return { image: post.image, link: post.link, title: post.title, description: post.description } })
        }
    } else {
        let objFind: any = ne ? { link: { $ne: ne } } : {}

        if (category) {
            category = await Category.findOne({ name: category }).exec() || false
            objFind = category ? { ...objFind, category: category._id } : objFind
        }

        if (authorFilter) {
            authorFilter = await User.findOne({ _id: UA?._id }).exec() || false
            objFind = authorFilter ? { ...objFind, author: authorFilter?._id } : objFind
        }

        let posts: any = Post.find(objFind)
        let count: any = Post.find(objFind)

        if (search) {
            let or = [
                { title: { $regex: rgx(search), $options: "i" } },
                { description: { $regex: rgx(search), $options: "i" } }
            ]
            count = count.or(or).collation({ locale: "en", strength: 2 })
            posts = posts.or(or).collation({ locale: "en", strength: 2 })
        }

        posts = posts.select(`${select} ${UA?.username ? "" : "-_id"}`)
        count = count.select(`${select} ${UA?.username ? "" : "-_id"}`)

        count = await count.countDocuments({}).exec()
        posts = await posts.skip(perPage * (((page >= 1) ? page : 1) - 1))
            .limit(perPage)
            .exec()
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

    let { perPage, page, search, select, category, ne, random, authorFilter } = req.query

    res.status(200).json(await listPosts({ perPage, page, search, select, category, ne, random, authorFilter, UA }))
}


export default handler