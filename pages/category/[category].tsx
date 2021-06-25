import React, { useState } from 'react'
import Layout from './../../layout/layout'
import { PostCard, Sidebar } from './../../components'
import { Category, CategoryI, Config, ConfigI, Post, PostI } from "../../database/models"
import DbConnect from './../../utils/dbConnect'
import { Document } from 'mongoose'
import { GetServerSideProps } from 'next'
import { getPageInfo } from '../../services/getPageInfo'
import { cache } from '../../services/cache'

const removeUndefinedForNextJsSerializing = <T,>(props: T): T =>
    Object.fromEntries(
        Object.entries(props).filter(([, value]) => value !== undefined),
    ) as T;

export const getServerSideProps: GetServerSideProps = async ({ req, res, params }) => {
    await DbConnect()

    const info = cache({name: "info"}, await getPageInfo())

    let category: CategoryI & Document<any, any> = null
    try {
        category = await Category.findOne({ name: String(params.category) }).exec()
    } catch (e) { }


    let posts: (PostI & Document<any, any>)[] = []
    if (category) {
        try {
            posts = await Post.find({ category: category?._id, publishDate: { $lte: new Date() } }).select("title description image link -_id").exec()
        } catch (e) { }
    }


    let categories: (CategoryI & Document<any, any>)[] = null
    try {
        categories = await Category.find({}).select("name color link -_id").exec()
    } catch (e) { }


    return {
        props: removeUndefinedForNextJsSerializing({
            info,
            posts: posts?.map(post => post.toJSON()),
            category: { name: category?.toJSON()?.name || null, color: category?.toJSON()?.color || null },
            categories: categories?.map(category => category.toJSON())
        })
    }
}

const Index = ({ posts, category, info, categories }) => {
    return (
        <>
            <Layout head={<title>{category?.name || "Não encontrado"} - {(info?.websiteName || "")}</title>} info={info} categories={categories}>
                <div className="container mx-auto">
                    <div className="grid grid-cols-3">
                        <div className="col-span-3 md:col-span-2">
                            <div className="px-4 mt-4">
                                <h1 className="text-4xl px-2 text-semibold text-gray-700">{category?.name || "Categoria não encontrada"}</h1>
                                <hr className="my-2" />
                            </div>
                            {
                                posts?.length > 0 ?
                                    posts?.map(post => <PostCard info={info} description={post.description} image={post.image} link={post.link} title={post.title} key={post.link} />) :
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
            </Layout>
        </>
    )
}


export default Index
