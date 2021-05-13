import DbConnect, { User } from "./../../../database/connection"

async function handler(req, res) {
    await DbConnect()
    const { username, email, password } = req.body
    switch (req.method) {
        case "GET":
            let userGet = await User.findOne({ username }).collation({ locale: "en", strength: 1 }).exec()
            res.status(200).json({ result: userGet })
            break;
        case "POST":
            let exists = {
                username: (await User.find({ username }).exec()).length > 0,
                email: (await User.find({ email }).exec()).length > 0,
            }
            if (exists.username || exists.email) {
                res.status(200).json({ exists })
            } else {
                let userPost = await (new User({ username, email, password })).save();
                res.status(200).json({ user: userPost })
            }
            break;
        case "PUT":
            let userPut = await User.findOneAndUpdate({ email }, { username, email, password }).exec();
            res.status(200).json({ result: userPut })
            break;
        case "DELETE":
            let userDelete = await User.find({ email }).remove().exec();
            res.status(200).json({ result: userDelete })
            break;
        default:
            res.status(200).json({})
            break;
    }
}

export default handler