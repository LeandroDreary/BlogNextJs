import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Navbar from '../../components/navbar'
import Link from 'next/link'
import api from '../../services/api'
import { FaSearch } from 'react-icons/fa'
import { useRouter } from 'next/router'
import '../../components/LoadClasses'
import Navigation from '../../components/navigation'
import DbConnect, { Config } from "./../../database/connection"
import { ListCategories } from '../api/category/list'

export async function getStaticProps() {
    await DbConnect()
    let { info, categories } = { info: null, categories: null }

    try {
        info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
        info = info._doc.content
    } catch (e) { }

    try {
        categories = (await ListCategories({})).result
    } catch (e) { }

    return {
        props: {
            info,
            categories
        },
        revalidate: 1
    }
}

const Index = ({ info, categories }: { info: any, categories }) => {
    const Router = useRouter()

    const [posts, setPosts] = useState<{ link: string, image: string, title: string, description: string }[]>()

    const [query, setQuery] = useState<{ perPage: number, page: number, pages: number, q: string, category: string }>({ q: "", page: 1, pages: 0, category: undefined, perPage: 12 })

    const [loading, setLoading] = useState<boolean>(true)

    const func = () => {
        setQuery({
            page: Number(Router.query?.page),
            perPage: Number(Router.query?.perPage),
            pages: 0,
            q: String(Router.query?.q || ""),
            category: String(Router.query?.category || "")
        })
    }

    const LoadQuery = (page?: number, perPage?: number, q?: string, category?: string) => {
        setLoading(true)
        api.get(`/api/post/list?select=title%20description%20image%20link` +
            `${perPage || Router.query?.perPage ? "&perPage=" + (perPage || Router.query?.perPage) : "&perPage=12"}` +
            `${page || Router.query?.page ? "&page=" + (page || Router.query?.page) : "&page=1"}` +
            `${category || Router.query?.category ? "&category=" + encodeURI((category || Router.query?.category).toString()) : ""}` +
            `${q || Router.query?.q ? "&search=" + encodeURI(String(q || Router.query?.q)) : ""}`
        ).then((response) => {
            setPosts(response.data?.result)
            setQuery({ ...query, ...response.data })
            setLoading(false)
        }).catch(() => { setLoading(false) })
    }

    useEffect(() => {
        if (process.browser) {
            func()
            LoadQuery()
        }
    }, [Router])

    return (
        <>
            <Head>
            </Head>
            <Navbar categories={categories} info={info} />
            <div className="container mx-auto">

                <div className="box pt-6">

                    <form onSubmit={e => {
                        e.preventDefault(); Router.push({
                            pathname: '/search',
                            search: `${query?.perPage ? "&perPage=" + query?.perPage : ""}` +
                                `${query?.page ? "&page=" + query?.page : ""}` +
                                `${query?.category ? "&category=" + encodeURI(query?.category) : ""}` +
                                `${query?.q ? "&q=" + encodeURI(query?.q) : ""}`
                        })
                    }}>

                        <div className={`bg-${info?.colors?.background?.color} py-4 px-6 mx-4 rounded-lg shadow-md box-wrapper`}>
                            <div className={`rounded flex items-center w-full p-3 shadow-sm border border-${info?.colors?.text?.color} text-${info?.colors?.text?.color}`}>
                                <input type="search" defaultValue={Router.query?.q} onChange={e => setQuery({ ...query, q: e.target.value })} placeholder="search" x-model="q" className={`placeholder-${info?.colors?.text?.shadow} font-semibold w-full text-sm outline-none focus:outline-none bg-transparent`} />
                                <button className="outline-none focus:outline-none px-4">
                                    <FaSearch />
                                </button>
                                <div className="select">
                                    <select x-model="image_type" onChange={e => setQuery({ ...query, category: e.target.value })} className={`text-sm outline-none focus:outline-none p-1 rounded-lg bg-${info?.colors?.background?.color}`}>
                                        <option className={`bg-white text-gray-700`} value="">All</option>
                                        {
                                            categories?.map(category => {
                                                return <option key={category?._id} className={`bg-white text-gray-700`} value={category?.name || ""}>{category?.name}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <Navigation callBack={page => LoadQuery(page)} info={info} page={query.page} pages={query.pages} />

                <div>
                    <hr />
                </div>


                {!loading ? posts.length > 0 ?
                    <div className="grid grid-cols-4 py-2"> {posts?.map((post, index) => {
                        return (
                            <Link key={index} href={"/post/" + post?.link}>
                                <a className="col-span-4 sm:col-span-2 lg:col-span-1 p-4">
                                    <div className="cursor-pointer p-4 border shadow-md h-full rounded-md">
                                        <div className="flex justify-center items-center p-3">
                                            <img className="w-full max-h-64 object-cover" src={post?.image} alt={post?.title} />
                                        </div>
                                        <div className="p-4">
                                            <h2 className="text-gray-900 font-semibold text-lg">{post?.title}</h2>
                                            <p className="text-gray-800 text-sm">{post?.description?.substr(0, 200) + (post?.description.length > 100 ? "..." : "")}</p>
                                        </div>
                                    </div>
                                </a>
                            </Link>
                        )
                    })}
                    </div> : <div className="my-32">
                        <h2 className="text-center font-semibold text-2xl text-gray-700">Not Found.</h2>
                    </div> :
                    <div className="my-32">
                        <img src="https://i.stack.imgur.com/kOnzy.gif" className="w-10 mx-auto" alt="loading" />
                    </div>
                }
                <div>
                    <hr />
                </div>
                <Navigation callBack={page => LoadQuery(page)} info={info} page={query.page} pages={query.pages} />
            </div>
        </>
    )
}

export default Index