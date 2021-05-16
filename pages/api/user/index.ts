import bcrypt from 'bcryptjs'
import Cookies from 'cookies'
import DbConnect, { User, UserI } from "./../../../database/connection"

async function handler(req, res) {
    await DbConnect()
    const cookies = new Cookies(req, res)
    let UA = bcrypt.compareSync(`${process.env.ADMINPASSWORD}_${process.env.ADMINUSERNAME}`, (cookies.get('AdminAreaAuth') || ""))

    let { _id, username, discordUser, activated, password } = req.body

    let warnings = []
    let user: any


    if (req.method === "POST") {
        if ((await User.find({ username }).exec()).length > 0)
            warnings.push({ message: "Nome de usuário já em uso.", input: "username" })
    }

    if (!UA)
        warnings.push({ message: "Você não está logado.", input: "warns" })

    if (warnings.length <= 0) {
        switch (req.method) {
            case "GET":
                user = await User.findOne({ username: req.query?.username }).exec()
                break;
            case "POST":
                user = await (new User({ username, discordUser, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) })).save();
                break;
            case "PUT":
                let u: UserI = await User.findOne({ _id }).exec()
                if (u?.password !== password)
                    password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
                if (u?.username !== username)
                    if ((await User.find({ username }).exec()).length > 0) {
                        res.status(200).json({ warnings })
                        warnings.push({ message: "Nome de usuário já em uso.", input: "username" })
                    }
                user = await User.findOneAndUpdate({ _id }, { username, discordUser, activated, password }).exec();
                break;
            case "DELETE":
                user = await User.find({ _id }).remove().exec();
                break;
            default:
                res.status(200).json({})
                break;
        }
        res.status(200).json({ result: user })
    } else {
        res.status(200).json({ warnings })
    }
}

export default handler