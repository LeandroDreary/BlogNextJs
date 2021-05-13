import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect, { Config } from "../../database/connection"


async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { name } = req.query
    const { content } = req.body
    await dbConnect()
    let config
    switch (req.method) {
        case "GET":
            config = await Config.findOne({ name }).exec();
            break;
        case "POST":
            config = await Config.findOne({ name }).exec();
            if (config?.content)
                config = await Config.findOneAndUpdate({ name }, { name, content }).exec()
            else
                config = await (new Config({ name, content })).save()
            break;
    }
    res.status(200).json({ result: config })
}

export default handler