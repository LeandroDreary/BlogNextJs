import React from 'react'
import Head from 'next/head'
import Navbar from './../components/navbar'
import Footer from './../components/footer'
import './../components/LoadClasses'
import { GetServerSideProps } from 'next'
import { Category, Config } from './../database/models'
import DbConnect from './../utils/dbConnect'
import ReactHtmlParser from 'react-html-parser'
import { FaDiscord, FaMailBulk, FaTwitter } from "react-icons/fa"

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    await DbConnect()
    let { info, categories } = { info: null, categories: null }

    try {
        info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
        info = info._doc.content
    } catch (e) { }

    try {
        categories = await Category.find({}).exec()
        categories = categories._doc.content
    } catch (e) { }

    return {
        props: {
            info,
            categories: categories?.map(c => { return { color: c?.color, link: c?.link || null, name: c?.name } })
        }

    }
}

const Index = ({ info, categories }) => {

    return (
        <>
            <Head>
                <title>Contato - {info?.websiteName}</title>
                <link rel="shortcut icon" href={info?.icon} type="image/x-icon" />
                {ReactHtmlParser(info?.customLayoutStyles)}
            </Head>
            <Navbar info={info} categories={categories} />
            <div className="container mx-auto">
                <div className="grid grid-cols-5 my-6 text-center md:text-left">
                    <div className={"col-span-5 px-4"}>
                        <h2 className={`text-4xl text-gray-900 my-4`}>Contato</h2>
                        <hr className="my-2" />
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
                            <a href="mailto:jornalzinhofc@gmail.com" className="text-xl flex items-center my-5" target="_blank" rel="noopener noreferrer">
                                <span className="mr-2 text-2xl text-gray-500">
                                    <FaMailBulk />
                                </span>
                                <span className="text-gray-700 hover:underline">
                                    jornalzinhofc@gmail.com
                                </span>
                            </a>
                            <a href="https://twitter.com/pequenojornal" className="text-xl flex items-center my-5" target="_blank" rel="noopener noreferrer">
                                <span className="mr-1 text-2xl text-blue-500">
                                    <FaTwitter />
                                </span>
                                <span className="text-gray-700 hover:underline">
                                    @pequenojornal
                                </span>
                            </a>
                            <a href="https://discord.gg/gou" className="text-xl flex items-center my-5" target="_blank" rel="noopener noreferrer">
                                <span className="mr-1 text-2xl text-blue-700">
                                    <FaDiscord />
                                </span>
                                <span className="text-gray-700 hover:underline">
                                    Servidor do Goularte
                                </span>
                            </a>
                        </div>
                    </div>
                    <div className="col-span-5 md:col-span-3 md:pt-4 pb-8 md:px-6">
                        <div className="mx-auto md:max-w-md px-6 border shadow-lg">
                            <div className="my-6">
                                <label htmlFor="websiteName" className="font-semibold text-gray-700">Nome: </label><br />
                                <input className="shadow appearance-none border w-full rounded py-1 px-3 text-gray-700" placeholder="Nome" type="text" name="nome" />
                            </div>
                            <div className="my-6">
                                <label htmlFor="websiteName" className="font-semibold text-gray-700">Email: </label><br />
                                <input className="shadow appearance-none border w-full rounded py-1 px-3 text-gray-700" placeholder="Email" type="email" name="email" />
                            </div>
                            <div className="my-6">
                                <label htmlFor="description" className="font-semibold text-gray-700">Mensagem: </label><br />
                                <textarea rows={6} className="shadow appearance-none border w-full rounded py-1 px-3 text-gray-700" placeholder="Mensagem" name="mensagem"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer info={info} />
        </>
    )


}

export default Index