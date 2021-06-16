import React from 'react'
import Link from 'next/link'
import LayoutAdminArea from './../../../../layout/layoutAdminArea'
import Router from 'next/router'
import FrmPost from '../../../../components/forms/post'
import { GetServerSideProps } from 'next'
import { Category, CategoryI, Config, ConfigI, User, UserI, Post, PostI } from "../../../../database/models"
import DbConnect from './../../../../utils/dbConnect'
import { Document } from 'mongoose'

const removeUndefinedForNextJsSerializing = <T,>(props: T): T =>
    Object.fromEntries(
        Object.entries(props).filter(([, value]) => value !== undefined),
    ) as T;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    await DbConnect()

    let info: ConfigI & Document<any, any> = null

    try {
        info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
    } catch (e) { }


    let categories: (CategoryI & Document<any, any>)[] = null
    try {
        categories = await Category.find({}).select(`name -_id`).exec()
    } catch (e) { }


    let authors: (UserI & Document<any, any>)[] = null
    try {
        authors = await User.find({}).select(`username -_id`).exec()
    } catch (e) { }
    

    let post = null
    try {
        post = await Post.findOne({ link: String(params.post) }).exec()
        post = {
            ...post?.toJSON(),
            _id: String(post?._id),
            publishDate: String(post?.publishDate),
            category: (await Category.findOne(post?.category).select(`name link -_id`).exec()).toJSON()?.name,
            author: (await User.findOne(post?.author).select(`username link -_id`).exec()).toJSON()?.username,
        }
    } catch (e) { }
    
    return {
        props: removeUndefinedForNextJsSerializing({
            info: info?.toJSON().content,
            post,
            user: { username: process.env.ADMINUSERNAME },
            authors: authors?.map(author => author.toJSON()),
            categories: categories?.map(category => category.toJSON())
        })
    }
}

function Blog({ info, user, authors, categories, post }) {
    return (
        <>
            <LayoutAdminArea head={<title>Editar post - {post?.title || "Postagem não encontrada."}</title>} info={info} user={user}>
                <div className="container mx-auto">
                    <div>
                        <Link href={'/AdminArea/post'}>
                            <a>
                                <button className={`mr-5 bg-${info?.colors?.background?.color} hover:bg-${info?.colors?.background?.shadow} text-${info?.colors?.text?.shadow} hover:text-${info?.colors?.text?.color} m-4 font-bold py-2 px-6 rounded-lg`}>
                                    Voltar
                                </button>
                            </a>
                        </Link>
                    </div>
                    <hr />
                    <div>
                        {
                            post?._id ?
                                <FrmPost requestAs={"AdminArea"} onSubmit={() => { Router.push('/AdminArea/post') }} info={info} Post={post} authors={authors} categories={categories} />
                                : <div className="flex justify-center items-center h-64">
                                    <h2 className="text-2xl">Postagem não encontrada.</h2>
                                </div>
                        }
                    </div>
                </div>
            </LayoutAdminArea>
        </>
    )
}



export default Blog