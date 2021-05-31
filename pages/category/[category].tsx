import React from 'react'
import Head from 'next/head'
import Navbar from '../../components/navbar'
import Card from '../../components/cards/post'
import Sidebar from '../../components/sidebar'
import '../../components/LoadClasses'
import { Category, Config } from "../../database/models"
import DbConnect from './../../utils/dbConnect'
import { listPosts } from "./../api/post/list"
import { ListCategories } from '../api/category/list'
import ReactHtmlParser from 'react-html-parser'
import Footer from './../../components/footer'

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: true,
    }
}

export async function getStaticProps(context) {
    let info = null
    let posts = null
    let categories = null
    let category = null

    await DbConnect()

    try {
        category = await Category.findOne({ name: context.params.category }).exec()
    } catch (e) { }

    if (category)
        try {
            posts = await listPosts({ select: "title description image link -_id", category: category?._id, beforeDate: new Date() })
        } catch (e) { }

    try {
        info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
        info = info._doc.content
    } catch (e) { }

    try {
        categories = (await ListCategories({})).result
    } catch (e) { }

    return {
        props: {
            posts,
            category: { name: category?._doc?.name || null, color: category?._doc?.color || null },
            info,
            categories
        },
        revalidate: 1
    }
}

const Index = ({ posts, category, info, categories }) => {
    return (
        <div>
            <Head>
                <title>{posts === undefined ? "Carregando..." : category?.name || "Não encontrado"}{info === undefined ? "" : " - " + (info?.websiteName || "")}</title>
                <link rel="shortcut icon" href={info?.icon} type="image/x-icon" />
                {ReactHtmlParser(info?.customLayoutStyles)}
            </Head>
            <Navbar categories={categories} info={info} />
            <div className="container mx-auto">
                <div className="grid grid-cols-3">
                    <div className="col-span-3 md:col-span-2">
                        <div className="px-4 mt-4">
                            <h1 className="text-4xl px-2 text-semibold text-gray-700">{posts === undefined ? "Carregando" : category?.name || "Categoria não encontrada"}</h1>
                            <hr className="my-2" />
                        </div>
                        {posts === undefined ?
                            <div className="flex justify-center items-center h-64">
                                Carregando...
                    </div> :
                            posts?.result?.length > 0 ?
                                posts?.result?.map(post => <Card info={info} description={post.description} image={post.image} link={post.link} title={post.title} key={post.link} />) :
                                <div className="text-gray-500 flex justify-center items-center h-64">
                                    Sem resultados encontrados.
                                </div>
                        }
                    </div>
                    <div className="col-span-3 mx-4 md:col-span-1 md:mx-0">
                        <Sidebar categories={categories} />
                    </div>
                </div>
            </div>
            <Footer info={info} />
        </div>
    )
}

export default Index
