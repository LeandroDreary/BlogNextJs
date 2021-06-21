import { Post, Category, User } from "../../../database/models"
import DbConnect from './../../../utils/dbConnect'
import { WarningI } from '../../../utils/types'
import { AdminAuthApi, AuthorAuthApi } from '../../../utils/authentication'

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

    let publishDate
    if (beforeDate)
        publishDate = { ...publishDate, $lte: beforeDate }

    if (afterDate > beforeDate && afterDate)
        publishDate = { ...publishDate, $gte: afterDate }

    if (publishDate)
        objFind = { ...objFind, publishDate }

    if (ne)
        objFind = { ...objFind, link: { $ne: ne } }

    if (search)
        objFind = {
            ...objFind,
            $or: [{ title: { $regex: rgx(search), $options: "i" } },
            { description: { $regex: rgx(search), $options: "i" } }]
        }

    if (category)
        objFind = { ...objFind, category }

    if (author)
        objFind = { ...objFind, author }

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

    // user Authentication
    let UAADM = await AdminAuthApi({ req, res }, ({ user }) => user)
    let UA = await AuthorAuthApi({ req, res }, ({ user }) => user)

    let warnings: WarningI[] = [];

    let { perPage, page, search, select, category, ne, author, beforeDate, afterDate, requestAs } = req.query

    try {
        beforeDate = new Date(beforeDate)
        beforeDate = beforeDate.getTime() === beforeDate.getTime() ? beforeDate : new Date()
    } catch (e) { beforeDate = new Date() }

    try {
        afterDate = new Date(afterDate)
        afterDate = afterDate.getTime() === afterDate.getTime() ? afterDate : new Date()
    } catch (e) { afterDate = new Date() }

    try {
        category = (await Category.findOne({ name: category }).exec())?._id || null
        switch (requestAs) {
            case "admin":
                if (UAADM) {
                    author = (await User.findOne({ username: author }).exec())?._id || null
                } else {
                    warnings.push({ message: "Você não está logado.", type: 'error', input: "" })
                }
                break;
            case "author":
                if (UA) {
                    author = UA?._id || null
                } else {
                    warnings.push({ message: "Você não está logado.", type: 'error', input: "" })
                }
                break;
            default:
                author = (await User.findOne({ username: author }).exec())?._id || null
                if (!(beforeDate < new Date()))
                    beforeDate = new Date()
                if (!(afterDate < new Date()))
                    afterDate = new Date()
                break;
        }
    } catch (e) { warnings.push({ message: "Ocorreu algo inesperado.", type: 'error', input: "" }) }

    let result = {}
    if (warnings.length <= 0)
        result = await listPosts({ perPage, page, search, select, category, ne, author, beforeDate, afterDate })

    res.status(200).json({ ...result, warnings })
}


export default handler