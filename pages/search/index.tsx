import React, { useEffect, useRef, useState } from 'react'
import { GetServerSideProps } from 'next'
import { Document } from 'mongoose'
import Layout from './../../layout/layout'
import { PostCard2, Navigation, SearchBar } from './../../components'
import api from '../../services/api'
import { useRouter } from 'next/router'
import { Category, CategoryI, User, UserI } from "../../database/models"
import DbConnect from './../../utils/dbConnect'
import { cache } from '../../services/cache'
import { getPageInfo } from '../../services/getPageInfo'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    await DbConnect()

    const info = cache({name: "info"}, await getPageInfo())

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
            authors: authors?.map(author => author.toJSON()),
            categories: categories?.map(category => category.toJSON())
        }
    }
}

const Index = ({ info, categories, authors }) => {

    const Router = useRouter()

    const [posts, setPosts] = useState<{ link: string, image: string, title: string, description: string }[]>()

    const [filters, setFilters] = useState<{ perPage: number, page: number, pages: number, search: string, category: string, author: string }>({ search: "", page: 1, pages: 0, category: "", author: "", perPage: 12 })

    const [loading, setLoading] = useState<boolean>(true)

    const LoadPost = async ({ page, perPage, author, category, search }: { page?: number, perPage?: number, author?: string, category?: string, search?: string }) => {
        setLoading(true)
        const params = {
            select: "title description image link",
            author: author || "",
            category: category || "",
            perPage: `${perPage || 12}`,
            page: `${page || 1}`,
            search: `${search || ""}`
        };
        await api.get(`/api/post/list`, { params, withCredentials: true }).then(res => {
            setPosts(res.data?.result);
            setLoading(false);
            setFilters({ ...filters, page, perPage, author, category, search, pages: res.data?.pages || 0 })
        }).catch(() => setLoading(false))
    }

    let removeEmpty: any = (obj) => {
        return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
    }

    useEffect(() => {
        if (Router.isReady) {
            let params = {
                author: Router.query?.author?.toString() || "",
                page: Number(Router.query?.page) || 1,
                perPage: Number(Router.query?.perPage) || 12,
                search: Router.query?.q?.toString() || "",
                category: Router.query?.category?.toString() || ""
            }
            setFilters({ ...filters, ...params })
            LoadPost(params)
        }
    }, [Router])



    return (
        <>
            <Layout head={<title>Procurar</title>} info={info} categories={categories}>
                <div className="container mx-auto">
                    <SearchBar datas={{
                        categories: categories?.map(category => { return { name: category.name, link: category.name } }),
                        authors: authors?.map(author => { return { name: author.username, link: author.username } }),
                        perPage: filters?.perPage,
                        search: filters?.search,
                        author: filters?.author || "",
                        category: filters?.category || ""
                    }} info={info} onSubmit={(e, datas) => {
                        e.preventDefault();
                        Router.push({
                            pathname: '/search',
                            search: new URLSearchParams(removeEmpty({
                                q: datas?.search === "" ? null : datas.search,
                                perPage: datas?.perPage === 12 ? null : String(datas.perPage),
                                page: filters?.page === 1 ? null : String(filters.page),
                                category: datas?.category === "" ? null : datas.category,
                                author: datas?.author === "" ? null : datas.author
                            })).toString()
                        })
                    }} />
                    <Navigation callBack={page => Router.push({
                        pathname: '/search',
                        search: new URLSearchParams(removeEmpty({
                            q: filters?.search === "" ? null : filters.search,
                            perPage: filters?.perPage === 12 ? null : String(filters.perPage),
                            page: page,
                            category: filters?.category === "" ? null : filters.category,
                            author: filters?.author === "" ? null : filters.author
                        })).toString()
                    })} info={info} page={filters.page} pages={filters.pages} />
                    <div>
                        <hr />
                    </div>
                    {!loading ? posts?.length > 0 ?
                        <div className="grid grid-cols-4 py-2"> {posts?.map(post => {
                            return <PostCard2 info={info} description={post?.description} image={post?.image} link={post?.link} title={post?.title} key={post.link} />
                        })}
                        </div> : <div className="my-32">
                            <h2 className="text-center font-semibold text-2xl text-gray-700">Nenhum resultado encontrado.</h2>
                        </div> :
                        <div className="my-32">
                            <img src="/img/load.gif" className="w-12 mx-auto" alt="loading" />
                        </div>
                    }
                    <div>
                        <hr />
                    </div>
                    <Navigation callBack={page => Router.push({
                        pathname: '/search',
                        search: new URLSearchParams(removeEmpty({
                            q: filters?.search === "" ? null : filters.search,
                            perPage: filters?.perPage === 12 ? null : String(filters.perPage),
                            page: page,
                            category: filters?.category === "" ? null : filters.category,
                            author: filters?.author === "" ? null : filters.author
                        })).toString()
                    })} info={info} page={filters.page} pages={filters.pages} />
                </div>
            </Layout>
        </>
    )
}

export default Index