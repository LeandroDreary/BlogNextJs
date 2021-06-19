import bcrypt from 'bcryptjs'
import Cookies from 'cookies'
import HandleAuth from '../../../services/auth'
import formidable from 'formidable';
import { User } from "../../../database/models"
import DbConnect from './../../../utils/dbConnect'
import sharp from 'sharp';
import imgbbUploader from 'imgbb-uploader';
import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose';

async function handler(req: NextApiRequest, res: NextApiResponse) {

    const form = new formidable.IncomingForm()

    form.parse(req, async (err, fields, files) => {
        await DbConnect()
        const cookies = new Cookies(req, res)

        let UAADM = bcrypt.compareSync(`${process.env.ADMINPASSWORD}_${process.env.ADMINUSERNAME}`, (cookies.get('AdminAreaAuth') || ""))
        let UA = await HandleAuth(cookies.get("auth"))

        let { _id, username, image, discordUser, activated, password } =
            { _id: fields?._id, username: fields?.username, image: "", discordUser: fields?.discordUser, activated: fields?.activated, password: fields?.password }

        let warnings = []
        let user: any

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
            if (password !== null && password !== undefined && password !== "") {
                if (password?.length < 6)
                    warnings.push({ message: "Senha deve ter no mínimo 6 carecteres.", input: "password" })
                if (password?.length > 12)
                    warnings.push({ message: "Senha deve ter no máximo 12 carecteres.", input: "password" })
            }
        }

        if ((req.method === "POST" && !UAADM) || (req.method === "PUT" && !UA))
            warnings.push({ message: "Você não está logado.", input: "" })
        if (warnings.length <= 0) {
            switch (req.method) {
                case "GET":
                    user = await User.findOne({ username: req.query?.username.toString() }).exec()
                    break;
                case "POST":
                    user = await (new User({ username, discordUser, activated: true, image: "", password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) })).save();
                    break;
                case "PUT":
                    user = await User.findOne(mongoose.Types.ObjectId(_id)).exec();
                    user.username = username
                    user.discordUser = discordUser
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
    });
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export default handler