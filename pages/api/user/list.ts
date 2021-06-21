import { User } from "../../../database/models"
import { AdminAuthApi } from '../../../utils/authentication'
import DbConnect from './../../../utils/dbConnect'

async function handler(req, res) {
    await DbConnect()
    const rgx = (pattern) => (new RegExp(`.*${pattern}.*`));

    let { perPage, page, search } = req.query

    // user Authentication
    let UAADM = await AdminAuthApi({ req, res }, ({ user }) => user)

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
    user = user.select(`${UAADM ? "" : "-_id"}`)
    count = count.select(`${UAADM ? "" : "-_id"}`)

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