import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { Document } from 'mongoose'
import { GetServerSideProps } from 'next'
import LayoutAdminArea from '../../../layout/layoutAdmin'
import Post from '../../../components/forms/post'
import { Category, CategoryI, Config, ConfigI, User, UserI } from '../../../database/models'
import DbConnect from './../../../utils/dbConnect'
import { AdminAuth } from '../../../utils/authentication'
import { getPageInfo } from '../../../services/getPageInfo'
import { cache } from '../../../services/cache'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    return AdminAuth({ req, res }, async ({ user }) => {
        await DbConnect()

        const info = cache({ name: "info" }, await getPageInfo());

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
                info,
                user,
                authors: authors?.map(author => author.toJSON()),
                categories: categories?.map(category => category.toJSON())
            }
        }
    })
}

const Index = ({ info, user, authors, categories }) => {
    return (
        <>
            <LayoutAdminArea head={<title>Novo post</title>} info={info} user={user}>
                <div className="container mx-auto">
                    <div>
                        <Link href={'/admin/post'}>
                            <a>
                                <button className={`mr-5 bg-${info?.colors?.background?.color} hover:bg-${info?.colors?.background?.shadow} text-${info?.colors?.text?.shadow} hover:text-${info?.colors?.text?.color} m-4 font-bold py-2 px-6 rounded-lg`}>
                                    Voltar
                                </button>
                            </a>
                        </Link>
                    </div>
                    <hr />
                    <div>
                        <Post requestAs={"admin"} onSubmit={() => { Router.push('/admin/post') }} info={info} authors={authors} categories={categories} />
                    </div>
                </div>
            </LayoutAdminArea>
        </>
    )
}

export default Index