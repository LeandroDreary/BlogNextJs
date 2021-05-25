import { NextApiRequest, NextApiResponse } from 'next'
import { Config } from "../../database/models"
import dbConnect from './../../utils/dbConnect'
import sharp from 'sharp';
import formidable from 'formidable';
import imgbbUploader from 'imgbb-uploader';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const form = new formidable.IncomingForm()

    form.parse(req, async (err, fields, files) => {
        const name = fields?.name
        let content
        let config
        switch (name) {
            case "info":
                {
                    let { websiteName, description, keywords, icon, colors, customLayoutStyles, customLayout } =
                        { websiteName: fields?.websiteName || "", description: fields?.description || "", keywords: fields?.keywords || "", icon: fields?.icon || "", colors: fields?.colors ? JSON.parse(fields?.colors) : null, customLayoutStyles: fields?.customLayoutStyles || "", customLayout: fields?.customLayout ? JSON.parse(fields?.customLayout) : null };
                    try {
                        if (files?.icon?.path) {
                            let base64string = (await sharp(files.icon?.path).webp().toBuffer()).toString('base64')
                            const options = { apiKey: "d11615f1d7ecafdc0230d615378e4eee", base64string };
                            icon = await imgbbUploader(options).then((res) => res?.url)
                        } else {
                            icon = fields?.image
                        }
                    } catch (e) {

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
                            const options = { apiKey: "d11615f1d7ecafdc0230d615378e4eee", base64string };
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

        await dbConnect()

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
        res.status(200).json({ result: content })
    })
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export default handler