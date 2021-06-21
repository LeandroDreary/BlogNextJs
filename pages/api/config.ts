import { NextApiRequest, NextApiResponse } from 'next'
import imgbbUploader from 'imgbb-uploader';
import sharp from 'sharp';
import formidable from 'formidable';
import fs from 'fs';
import { ConfigModel } from "../../database/models"
let Config = ConfigModel()
import dbConnect from './../../utils/dbConnect'
import { AdminAuthApi } from '../../utils/authentication';
import { WarningI } from '../../utils/types';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const form = new formidable.IncomingForm()

    try {
        return await form.parse(req, async (err, fields, files) => {
            let warnings: WarningI[] = []
            const name = fields?.name
            let content
            let config

            let AdminAuth = await AdminAuthApi({ req, res }, ({ user }) => user)

            if (req.method !== 'GET') {
                if (!AdminAuth)
                    warnings.push({ message: "Usuário não está logado.", input: "", type: "error" })
            }

            if (warnings.length <= 0) {
                await dbConnect()

                if (req.method !== 'GET')
                    switch (name) {
                        case "info":
                            {
                                let { websiteName, description, keywords, icon, colors, customLayoutStyles, customLayout } =
                                    { websiteName: fields?.websiteName || "", description: fields?.description || "", keywords: fields?.keywords || "", icon: fields?.icon || "", colors: fields?.colors ? JSON.parse(fields?.colors) : null, customLayoutStyles: fields?.customLayoutStyles || "", customLayout: { colors: fields?.customLayout ? JSON.parse(fields?.customLayout)?.colors || {} : null } };
                                let iconICO
                                try {
                                    if (files?.icon?.path) {
                                        let base64string = (await sharp(files.icon?.path).webp().toBuffer()).toString('base64')
                                        const options = { apiKey: process.env.IMGBB_APIKEY, base64string };
                                        icon = await imgbbUploader(options).then((res) => res?.url)
                                    } else {
                                        icon = fields?.image
                                    }
                                } catch (e) {
                                    console.log(e)
                                }

                                try {
                                    if (files?.iconICO?.path) {
                                        iconICO = fs.readFileSync(files.iconICO?.path, { encoding: 'base64' })
                                        let Config = ConfigModel()
                                        config = await Config.findOne({ name: "IconIco" }).exec();
                                        if (config?._id)
                                            config = await Config.findOneAndUpdate({ name: "IconIco" }, { name: "IconIco", content: { iconICO } }).exec()
                                        else
                                            config = await (new Config({ name: "IconIco", content: { iconICO } })).save()
                                    } else {
                                        iconICO = fields?.iconICO
                                    }
                                } catch (e) {
                                    console.log(e)
                                }

                                content = { websiteName, description, keywords, icon, colors, customLayoutStyles, customLayout }
                            }
                            break;
                        case "homePageInfo":
                            {
                                let { title, description, banner, head } =
                                    { title: fields?.title || "", description: fields?.description || "", banner: fields?.banner || "", head: fields?.head || "" };
                                try {
                                    if (files?.banner?.path) {
                                        let base64string = (await sharp(files.banner?.path).webp().toBuffer()).toString('base64')
                                        const options = { apiKey: process.env.IMGBB_APIKEY, base64string };
                                        banner = await imgbbUploader(options).then((res) => res?.url)
                                    } else {
                                        banner = fields?.banner
                                    }
                                } catch (e) {

                                }
                                content = { title, description, banner, head }
                            }
                            break;
                    }

                Config = ConfigModel()


                switch (req.method) {
                    case "GET":
                        config = await Config.findOne({ name }).exec();
                        break;
                    case "POST":
                        config = await Config.findOne({ name }).exec();
                        if (config?._id)
                            config = await Config.findOneAndUpdate({ name }, { name, content }).exec()
                        else
                            config = await (new Config({ name, content })).save()
                        break;
                }
                return res.status(200).json({ result: content })
            }
            return res.status(200).json({ warnings })
        })
    } catch (e) { return res.status(200).json({ warnings: [{ message: "Algo deu errado.", input: "", type: "error" }] }) }
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export default handler