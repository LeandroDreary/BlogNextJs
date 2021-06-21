import bcrypt from 'bcryptjs'
import formidable from 'formidable';
import { User } from "../../../database/models"
import DbConnect from './../../../utils/dbConnect'
import sharp from 'sharp';
import imgbbUploader from 'imgbb-uploader';
import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose';
import { AdminAuthApi, AuthorAuthApi } from '../../../utils/authentication';

async function handler(req: NextApiRequest, res: NextApiResponse) {

    const form = new formidable.IncomingForm()

    form.parse(req, async (err, fields, files) => {
        // user Authentication
        let UAADM = await AdminAuthApi({ req, res }, ({ user }) => user)
        let UA = await AuthorAuthApi({ req, res }, ({ user }) => user)

        await DbConnect()

        let _id = fields?._id || req.body?._id
        let username = fields?.username || req.body?.username
        let link = fields?.link || req.body?.link
        let image = fields?.image || req.body?.image || ""
        let discordUser = fields?.discordUser || req.body?.discordUser
        let activated = fields?.activated || req.body?.activated
        let password = fields?.password || req.body?.password
        let requestAs: "admin" | "author" = fields?.requestAs || req.body?.requestAs

        let warnings = []
        let user: any
        if (req.method !== "GET") {
            switch (requestAs) {
                case "admin":
                    if (!UAADM)
                        warnings.push({ message: "Você não está logado.", input: "" })
                    break;
                case "author":
                    if (!UA)
                        warnings.push({ message: "Você não está logado.", input: "" })
                    if (req.method !== "PUT")
                        warnings.push({ message: "Você não tem permissão para utilizar esse método.", input: "" })
                    break;
                default:
                    break;
            }
        }
        if (warnings.length <= 0) {
            if (req.method === "PUT") {
                if (UAADM) {
                    if ((await User.find({ username, _id: { $ne: _id ? mongoose.Types.ObjectId(_id) : UA?._id } }).collation({ locale: "en", strength: 2 }).exec()).length > 0)
                        warnings.push({ message: "Nome de usuário já em uso.", input: "username" })
                    else
                        _id = _id ? _id : UA?._id

                } else {
                    if ((await User.find({ username, _id: { $ne: UA?._id } }).collation({ locale: "en", strength: 2 }).exec()).length > 0)
                        warnings.push({ message: "Nome de usuário já em uso.", input: "username" })
                    else
                        _id = UA?._id
                }
                try {
                    if (files?.image?.path) {
                        let base64string = (await sharp(files.image?.path).webp().toBuffer()).toString('base64')
                        const options = { apiKey: process.env.IMGBB_APIKEY, base64string };
                        image = await imgbbUploader(options).then((response) => response?.url);
                    } else {
                        image = fields?.image
                    }
                } catch (e) {
                    console.error(e)
                    warnings?.push({ message: "Ocorreu um erro ao tentar enviar a imagem.", input: "" })
                }
            }

            if (req.method === "POST" || req.method === "PUT") {
                if (username?.length < 4)
                    warnings.push({ message: "Usuário deve ter no mínimo 4 carecteres.", input: "username" })
                if (username?.length > 12)
                    warnings.push({ message: "Usuário deve ter no máximo 12 carecteres.", input: "username" })
                if (link?.length < 4)
                    warnings.push({ message: "Link deve ter no mínimo 4 carecteres.", input: "link" })
                if (link?.length > 15)
                    warnings.push({ message: "Link deve ter no máximo 15 carecteres.", input: "link" })
                if (!password) {
                    if (password?.length < 6)
                        warnings.push({ message: "Senha deve ter no mínimo 6 carecteres.", input: "password" })
                    if (password?.length > 12)
                        warnings.push({ message: "Senha deve ter no máximo 12 carecteres.", input: "password" })
                }
            }

            if (warnings.length <= 0) {
                switch (req.method) {
                    case "GET":
                        user = await User.findOne({ username: req.query?.username.toString() }).exec()
                        break;
                    case "POST":
                        user = await (new User({ username, discordUser, link, activated: true, image: "", password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) })).save();
                        break;
                    case "PUT":
                        user = await User.findOne(mongoose.Types.ObjectId(_id)).exec();
                        user.username = username
                        user.discordUser = discordUser
                        user.link = link
                        user.image = image
                        if (activated !== null && activated !== undefined && UAADM)
                            user.activated = activated
                        if (password !== null && password !== undefined && password !== "")
                            user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
                        await user.save()
                        break;
                    case "DELETE":
                        user = await User.find({ _id }).remove().exec();
                        break;
                }

                res.status(200).json({ result: user, warnings: [{ message: "Dados atualizados com sucesso.", input: "", success: true }] })
            } else {
                res.status(200).json({ warnings })
            }
        }
        res.status(200).json({ warnings })
    });
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export default handler