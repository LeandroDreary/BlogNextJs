import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import LayoutAdminArea from './../../../layout/layoutAdminArea'
import Post from '../../../components/forms/post'
import { GetServerSideProps } from 'next'
import { Category, CategoryI, Config, ConfigI, User, UserI } from '../../../database/models'
import DbConnect from './../../../utils/dbConnect'
import { Document } from 'mongoose'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
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


    return {
        props: {
            info: info.toJSON().content,
            user: { username: process.env.ADMINUSERNAME },
            authors: authors?.map(author => author.toJSON()),
            categories: categories?.map(category => category.toJSON())
        }
    }
}

const Index = ({ info, user, authors, categories }) => {
    return (
        <>
            <LayoutAdminArea head={<title>Novo post</title>} info={info} user={user}>
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
                        <Post requestAs={"AdminArea"} onSubmit={() => { Router.push('/AdminArea/post') }} info={info} authors={authors} categories={categories} />
                    </div>
                </div>
            </LayoutAdminArea>
        </>
    )
}

export default Index