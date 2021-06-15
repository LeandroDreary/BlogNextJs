import React from 'react'
import Link from 'next/link'
import Cookies from 'cookies'
import Router from 'next/router'
import LayoutAdmin from './../../../layout/layoutAdmin'
import Post from '../../../components/forms/post'
import { GetServerSideProps } from 'next'
import HandleAuth from '../../../services/auth'
import { Category, CategoryI, Config, ConfigI } from '../../../database/models'
import DbConnect from './../../../utils/dbConnect'
import { Document } from 'mongoose'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    await DbConnect()
    const cookies = new Cookies(req, res)

    let user = await HandleAuth(cookies.get("auth") || "na")

    if (user?.username) {

        let info: ConfigI & Document<any, any> = null
        try {
            info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
        } catch (e) { }


        let categories: (CategoryI & Document<any, any>)[] = null
        try {
            categories = await Category.find({}).select(`name -_id`).exec()
        } catch (e) { }


        let authors = null
        try {
            authors = [{ username: user.toJSON()?.username, link: user.toJSON()?.link || null }]
        } catch (e) { }

        return {
            props: {
                info: info.toJSON().content,
                user: { username: user.username },
                authors: authors,
                categories: categories?.map(category => category.toJSON())
            }
        }
    } else {
        cookies.get("set")
        return {
            redirect: {
                destination: '/admin/signin',
                permanent: false,
            }
        }
    }
}

const Index = ({ info, user, authors, categories }) => {
    return (
        <>
            <LayoutAdmin head={<title>Novo Post</title>} info={info} user={user}>
                <div className="container mx-auto">
                    <div>
                        <Link href='/admin/post'>
                            <a>
                                <button className={`mr-5 bg-${info?.colors?.background?.color} hover:bg-${info?.colors?.background?.shadow} text-${info?.colors?.text?.shadow} hover:text-${info?.colors?.text?.color} m-4 font-bold py-2 px-6 rounded-lg`}>
                                    Voltar
                                </button>
                            </a>
                        </Link>
                    </div>
                    <hr />
                    <div>
                        <Post requestAs={"Admin"} onSubmit={() => { Router.push('/admin/post') }} info={info} authors={authors} categories={categories} />
                    </div>
                </div>
            </LayoutAdmin>
        </>
    )
}

export default Index