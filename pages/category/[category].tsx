import React from 'react'
import Head from 'next/head'
import Navbar from '../../components/navbar'
import Card from '../../components/cards/post'
import Sidebar from '../../components/sidebar'
import '../../components/LoadClasses'
import DbConnect, { Config } from "./../../database/connection"
import { listPosts } from "./../api/post/list"
import { ListCategories } from '../api/category/list'
export async function getStaticPaths() {
    return {
        paths: [],
        fallback: true,
    }
}

export async function getStaticProps(context) {
    let info = null
    let posts: any = false
    let categories = null
    await DbConnect()

    try {
        posts = await listPosts({ select: "title description image link -_id", category: context.params.category })
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
            category: context.params.category,
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
                <title>{posts === undefined ? "Carregando" : category || "Not Found"}</title>
            </Head>
            <Navbar categories={categories} info={info} />
            <div className="container mx-auto">
                <div className="grid grid-cols-3">
                    <div className="col-span-3 md:col-span-2">
                        <div className="px-4 mt-4">
                            <h1 className="text-4xl px-2 text-semibold text-gray-700">{posts === undefined ? "Carregando" : category || ""}</h1>
                            <hr className="my-2" />
                        </div>
                        {posts === undefined ?
                            <div className="flex justify-center items-center h-64">
                                Carregando...
                    </div> :
                            posts?.result ?
                                posts?.result?.map(post => <Card description={post.description} image={post.image} link={post.link} title={post.title} key={post.link} />) :
                                <div className="flex justify-center items-center h-64">
                                    Not Found.
                                </div>
                        }
                    </div>
                    <div className="col-span-3 mx-4 md:col-span-1 md:mx-0">
                        <Sidebar categories={categories} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index
