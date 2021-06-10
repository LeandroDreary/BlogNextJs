import React from 'react'
import Layout from './../layout/layout'
import './../components/LoadClasses'
import { GetServerSideProps } from 'next'
import { Category, Config } from '../database/models'
import DbConnect from '../utils/dbConnect'

export const getServerSideProps: GetServerSideProps = async () => {
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
            <Layout head={<title>Sobre - {info?.websiteName}</title>} info={info} categories={categories}>
                <div className="mx-auto container grid grid-cols-5 pb-4 items-center">
                    <div className="col-span-5 md:col-span-3 px-3 md:px-6 my-8">
                        <h1 className="text-2xl font-semibold text-gray-700 mb-2">Este é o nosso Jornalzinho!</h1>
                        <hr />
                        <p className="text-lg text-gray-600 my-6">
                            Pequeno Jornal é uma equipe de jornalistas e colunistas sérios e bem preparados na produção de notícias e artigos sobre vários assuntos, bem como: animes, séries, filmes, jogos, atualidades, tecnologia e afins.
                    </p>
                        <p className="text-lg text-gray-600 my-6">
                            Ele surgiu como um ímpeto para que pudéssemos informar e promover conteúdos criativos e disruptivos, além de nos conectar ainda mais. E sendo desta forma, não se trata apenas de textos e notícias. Nosso jornal não busca somente levar informação e entretenimento para aqueles que se interessam, somos como uma família, construímos relações e interesses em comum.
                    </p>
                        <p className="text-lg text-gray-600 my-6">
                            É um lugar para se expressar, compartilhar conhecimento e fazer amigos.
                    </p>
                    </div>
                    <div className="col-span-5 md:col-span-2 my-8">
                        <div className={`mx-4`}>
                            <img className="w-full p-6 mx-auto" src={info?.icon} alt="" />
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )


}

export default Index