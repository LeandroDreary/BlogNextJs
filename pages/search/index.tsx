import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import Navbar from '../../components/navbar'
import Link from 'next/link'
import api from '../../services/api'
import { FaSearch } from 'react-icons/fa'
import { useRouter } from 'next/router'
import '../../components/LoadClasses'
import Navigation from '../../components/navigation'
import { Config } from "../../database/models"
import DbConnect from './../../utils/dbConnect'
import { ListCategories } from '../api/category/list'
import ReactHtmlParser from 'react-html-parser'

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

const Index = ({ info, categories }) => {

    const Router = useRouter()

    const search = useRef<HTMLInputElement>()

    const [posts, setPosts] = useState<{ link: string, image: string, title: string, description: string }[]>()

    const [query, setQuery] = useState<{ perPage: number, page: number, pages: number, q: string, category: string }>({ q: "", page: 1, pages: 0, category: undefined, perPage: 12 })

    const [loading, setLoading] = useState<boolean>(true)




    const LoadQuery = (page?: number, perPage?: number, q?: string, category?: string) => {
        setLoading(true)

        let qry = "?select=title%20description%20image%20link"
        qry += `&perPage=${perPage || Router.query?.perPage || 12}`
        qry += `&page=${page || Router.query?.page || 1}`
        qry += `&category=${encodeURI((category || Router.query?.category || "").toString())}`
        qry += `&search=${encodeURI(String(q || search.current?.value || ""))}`

        api.get(`/api/post/list${qry}`).then(res => {
            setPosts(res.data?.result)
            setQuery({ ...query, ...res.data })
            setLoading(false)
        }).catch(() => { setLoading(false) })
    }

    useEffect(() => {
        if (Router.isReady) {
            search.current.value = String(Router.query?.q || "")
            setQuery({
                page: Number(Router.query?.page),
                perPage: Number(Router.query?.perPage),
                pages: 0,
                q: String(search.current?.value || ""),
                category: String(Router.query?.category || "")
            })
            LoadQuery()
        }
    }, [Router])

    return (
        <>
            <Head>
                <title>Procurar</title>
                {ReactHtmlParser(info?.customLayoutStyles)}
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
                                `${search.current?.value ? "&q=" + encodeURI(search.current?.value) : ""}`
                        })
                    }}>

                        <div className={`bg-${info?.colors?.background?.color} py-4 px-6 mx-4 rounded-lg shadow-md box-wrapper`}>
                            <div className={`rounded flex items-center w-full p-3 shadow-sm border border-${info?.colors?.text?.color} text-${info?.colors?.text?.color}`}>
                                <input ref={search} type="search" placeholder="search" x-model="q" className={`placeholder-${info?.colors?.text?.shadow} font-semibold w-full text-sm outline-none focus:outline-none bg-transparent`} />
                                <button className="outline-none focus:outline-none px-4">
                                    <FaSearch />
                                </button>
                                <div className="select">
                                    <select x-model="image_type" onChange={e => setQuery({ ...query, category: e.target.value })} className={`text-sm outline-none focus:outline-none p-1 rounded-lg bg-${info?.colors?.background?.color}`}>
                                        <option className={`bg-white text-gray-700`} value="">All</option>
                                        {
                                            categories?.map(category => {
                                                return <option key={`${category?.name + category?.color}`} className={`bg-white text-gray-700`} value={category?.name || ""}>{category?.name}</option>
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


                {!loading ? posts?.length > 0 ?
                    <div className="grid grid-cols-4 py-2"> {posts?.map(post => {
                        return (
                            <Link key={post.link} href={"/post/" + post?.link}>
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
                        <h2 className="text-center font-semibold text-2xl text-gray-700">Nenhum resultado encontrado.</h2>
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