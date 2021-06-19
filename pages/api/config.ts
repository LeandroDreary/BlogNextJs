import { NextApiRequest, NextApiResponse } from 'next'
import { ConfigModel } from "../../database/models"
let Config = ConfigModel()
import dbConnect from './../../utils/dbConnect'
import sharp from 'sharp';
import formidable from 'formidable';
import imgbbUploader from 'imgbb-uploader';
import fs from 'fs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const form = new formidable.IncomingForm()

    await form.parse(req, async (err, fields, files) => {
        const name = fields?.name
        let content
        let config

        await dbConnect()

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
        res.status(200).json({ result: content })
    })
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export default handler