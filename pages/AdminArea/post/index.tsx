import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import LayoutAdminArea from './../../../layout/layoutAdminArea'
import Cookies from 'cookies'
import Api from './../../../services/api'
import { PostCardAdmin, Navigation, SearchBar } from '../../../components'
import { GetServerSideProps } from 'next'
import bcrypt from 'bcryptjs'
import { Category, CategoryI, Config, ConfigI, User, UserI } from '../../../database/models'
import DbConnect from './../../../utils/dbConnect'
import { Document } from 'mongoose'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    await DbConnect()

    const cookies = new Cookies(req, res)

    if (bcrypt.compareSync(`${process.env.ADMINPASSWORD}_${process.env.ADMINUSERNAME}`, (cookies.get('AdminAreaAuth') || ""))) {

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
    } else {
        return {
            redirect: {
                destination: '/AdminArea/signin',
                permanent: false,
            }
        }
    }
}

const Index = ({ info, user, categories, authors }) => {
    const [posts, setPosts] = useState<{ title: string, description: string, image: string, link: string }[]>()

    const [filters, setFilters] = useState<{ perPage: number, page: number, pages: number, search: string, category: string, author: string }>({ search: "", page: 1, pages: 0, category: "", author: "", perPage: 12 })
    const [loading, setLoading] = useState<boolean>(false);


    const LoadPost = ({ page, perPage, author, category, search }: { page?: number, perPage?: number, author?: string, category?: string, search?: string }) => {
        setLoading(true)
        setFilters({ ...filters, page, perPage, author, category, search })
        const params = {
            select: "title description image link",
            author: author || "",
            category: category || "",
            perPage: `${perPage || 12}`,
            page: `${page || 1}`,
            search: `${search || ""}`,
            requestAs: "adminArea"
        };
        Api.get(`/api/post/list`, { params, withCredentials: true }
        ).then(response => {
            setPosts(response.data?.result);
            setLoading(false);
            setFilters({ ...filters, ...response.data, page, perPage, author, category, search })
        }).catch(() => setLoading(false))
    }

    useEffect(() => {
        LoadPost({})
    }, [])


    return (
        <>
            <LayoutAdminArea head={<title>{filters?.search || "Postagens"} - {info?.websiteName || ""}</title>} info={info} user={user}>
                <div className="container mx-auto">
                    <Link href="/AdminArea/post/create">
                        <a>
                            <button className={`mr-5 my-4 bg-${info?.colors.background?.color} hover:bg-${info?.colors.background?.shadow} text-${info?.colors.text?.shadow} hover:text-${info?.colors.text?.color} font-bold py-2 px-6 rounded-lg`}>
                                Nova postagem
                            </button>
                        </a>
                    </Link>
                    <button onClick={() => LoadPost({})} className="mr-5 my-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg">
                        Recarregar
                    </button>
                    <hr />
                    <SearchBar datas={{
                        categories: categories?.map(category => { return { name: category.name, link: category.name } }),
                        authors: authors?.map(author => { return { name: author.username, link: author.username } }),
                        perPage: filters.perPage,
                        search: filters.search
                    }} info={info} onSubmit={(e, datas) => { e.preventDefault(); LoadPost({ perPage: datas.perPage, search: datas.search, author: datas.author, category: datas.category }); }} />
                    <Navigation callBack={page => LoadPost({ ...filters, page })} info={info} page={filters.page} pages={filters.pages} />
                    <hr />
                    <div className="grid grid-cols-4 py-2">
                        {!loading ? posts?.map((post, index) => {
                            return <PostCardAdmin post={post} info={info} editLink={'/AdminArea/post/edit/' + encodeURI(post.link)} reload={() => LoadPost({})} key={index} />
                        }) :
                            <div className="col-span-4 flex justify-center items-center h-64">
                                <img src="/img/load.gif" alt="loading" className="w-12" />
                            </div>
                        }
                    </div>
                    <hr />
                    <Navigation callBack={page => LoadPost({ ...filters, page })} info={info} page={filters.page} pages={filters.pages} />
                </div>
            </LayoutAdminArea>
        </>
    )

}

export default Index