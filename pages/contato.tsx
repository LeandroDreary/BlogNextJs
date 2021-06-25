import React from 'react'
import Layout from './../layout/layout'
import { GetServerSideProps } from 'next'
import { Category } from './../database/models'
import DbConnect from './../utils/dbConnect'
import { FaDiscord, FaMailBulk, FaTwitter } from "react-icons/fa"
import getRawBody from 'raw-body';
import nodemailer from 'nodemailer';
import { cache } from '../services/cache'
import { getPageInfo } from '../services/getPageInfo'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    await DbConnect()
    let { info, categories, warnings } = { info: null, categories: null, warnings: [] }
    var searchParams = new URLSearchParams((await getRawBody(req)).toString("utf-8"));
    const { name, email, message } = { name: searchParams.get("usernnameame"), email: searchParams.get("email"), message: searchParams.get("message") }

    switch (req.method) {
        case "POST":
            const transporter = nodemailer.createTransport({
                service: process.env.EMAILSERVICE,
                auth: {
                    user: process.env.EMAILUSER,
                    pass: process.env.EMAILPASS
                }
            });
            transporter.sendMail({
                from: process.env.EMAILUSER,
                to: 'jornalzinhofc@gmail.com',
                subject: `Mensagem de ${name}`,
                text: message,
                html: `
                <h2 style="color: #333;margin: 12px;">Mensagem de ${name}</h2>
                <p style="color: #333;margin: 12px; font-size: 18px;">${message}</p>
                <p style="color: #333;margin: 12px;">Email: ${email}</p>`
            }, (err, result) => {
                if (err) return warnings.push({ message: "Algo não ocorreu como esperado.", input: "", success: false })
                warnings.push({ message: "Mensagem enviada com sucesso.", input: "", success: true })
            })

            break;
    }

    info = cache({name: "info"}, await getPageInfo())

    try {
        categories = await Category.find({}).exec()
        categories = categories._doc.content
    } catch (e) { }

    return {
        props: {
            info,
            categories: categories?.map(c => { return { color: c?.color, link: c?.link || null, name: c?.name } }),
            warnings
        }

    }
}

const Index = ({ info, categories, warnings }) => {
    return (
        <>
            <Layout head={<title>Contato - {info?.websiteName}</title>} info={info} categories={categories}>
                <div className="container mx-auto">
                    <div className="grid grid-cols-5 my-6 text-center md:text-left">
                        <div className={"col-span-5 px-4"}>
                            <h2 className={`text-4xl text-gray-900 my-4`}>Contato</h2>
                            <hr className="my-2" />
                            {
                                warnings.map(warning => {
                                    if (warning?.input === "" && !warning?.success)
                                        return <p key={warning.message + warning.success} className="w-full text-center border border-red-400 py-3 bg-red-50 text-red-400 text-xs italic font-bold my-2">{warning.message}</p>
                                    if (warning?.input === "" && warning?.success)
                                        return <p key={warning.message + warning.success} className="w-full text-center border border-green-400 py-3 bg-green-50 text-green-400 text-xs italic font-bold my-2">{warning.message}</p>
                                })
                            }
                        </div>
                        <div className="col-span-5 md:col-span-2 py-4 px-2 sm:px-8">
                            <p className="my-3 text-xl text-gray-800">
                                Ei, vamos conversar!
                            </p>
                            <p className="my-3 text-lg text-gray-600">
                                Não hesite em falar conosco por meio das informações de contato abaixo ou envie uma mensagem usando o formulário.
                            </p>
                            <hr className="my-2" />
                            <div className="col-span-5 py-4 md:px-4 md:col-span-2">
                                <a href="" className="text-xl flex items-center my-5" target="_blank" rel="noopener noreferrer">
                                    <span className="mr-2 text-2xl text-gray-500">
                                        <FaMailBulk />
                                    </span>
                                    <span className="text-gray-700 hover:underline">
                                        
                                    </span>
                                </a>
                                <a href="" className="text-xl flex items-center my-5" target="_blank" rel="noopener noreferrer">
                                    <span className="mr-1 text-2xl text-blue-500">
                                        <FaTwitter />
                                    </span>
                                    <span className="text-gray-700 hover:underline">
                                        
                                    </span>
                                </a>
                                <a href="" className="text-xl flex items-center my-5" target="_blank" rel="noopener noreferrer">
                                    <span className="mr-1 text-2xl text-blue-700">
                                        <FaDiscord />
                                    </span>
                                    <span className="text-gray-700 hover:underline">
                                        
                                    </span>
                                </a>
                            </div>
                        </div>
                        <div className="col-span-5 md:col-span-3 md:pt-4 pb-8 md:px-6">
                            <form method="POST" className="mx-auto md:max-w-md bg-white px-6 border shadow-lg">
                                <div className="my-6">
                                    <label htmlFor="websiteName" className="font-semibold text-gray-700">Nome: </label><br />
                                    <input className="shadow appearance-none border w-full rounded py-1 px-3 text-gray-700" placeholder="Nome" type="text" name="name" />
                                </div>
                                <div className="my-6">
                                    <label htmlFor="websiteName" className="font-semibold text-gray-700">Email: </label><br />
                                    <input className="shadow appearance-none border w-full rounded py-1 px-3 text-gray-700" placeholder="Email" type="email" name="email" />
                                </div>
                                <div className="mt-6 mb-2">
                                    <label htmlFor="description" className="font-semibold text-gray-700">Mensagem: </label><br />
                                    <textarea rows={6} className="shadow appearance-none border w-full rounded py-1 px-3 text-gray-700" placeholder="Mensagem" name="message"></textarea>
                                </div>
                                <hr />
                                <div className="mb-6 mt-3">
                                    <input type="submit" value="enviar" className={`bg-${info?.colors?.background?.color} hover:bg-${info?.colors?.background?.shadow} px-4 py-2 text-${info?.colors?.text?.shadow} hover:text-${info?.colors?.text?.color} font-semibold`} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )


}

export default Index