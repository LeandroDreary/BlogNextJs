import React, { useEffect, useRef, useState } from 'react'
import Layout from './../../layout/layout'
import PostCard2 from './../../components/cards/post2'
import api from '../../services/api'
import { FaSearch } from 'react-icons/fa'
import { useRouter } from 'next/router'
import '../../components/LoadClasses'
import Navigation from '../../components/navigation'
import { Config } from "../../database/models"
import DbConnect from './../../utils/dbConnect'
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

const Index = ({ info, categories }) => {

    const Router = useRouter()

    const search = useRef<HTMLInputElement>()

    const [posts, setPosts] = useState<{ link: string, image: string, title: string, description: string }[]>()

    const [query, setQuery] = useState<{ perPage: number, page: number, pages: number, q: string, category: string }>({ q: "", page: 1, pages: 0, category: undefined, perPage: 12 })

    const [loading, setLoading] = useState<boolean>(true)




    const LoadQuery = (page?: number, perPage?: number, q?: string, category?: string) => {
        setLoading(true)
        const params = {
            select: "title description image link",
            perPage: `${perPage || Router.query?.perPage || 12}`,
            page: `${page || Router.query?.page || 1}`,
            category: `${category || Router.query?.category || ""}`,
            search: `${q || search.current?.value || ""}`,
        };
        api.get(`/api/post/list`, { params }).then(res => {
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
            <Layout head={<title>Procurar</title>} info={info} categories={categories}>
                <div className="container mx-auto">
                    <div className="box pt-6">
                        <form onSubmit={e => {
                            e.preventDefault(); Router.push({
                                pathname: '/search',
                                search: new URLSearchParams({
                                    perPage: (query?.perPage || "").toString(),
                                    page: (query?.page || "").toString(),
                                    category: (query?.category || "").toString(),
                                    q: (search.current?.value || "").toString()
                                }).toString()
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
                            return <PostCard2 info={info} description={post?.description} image={post?.image} link={post?.link} title={post?.title} key={post.link} />
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
            </Layout>
        </>
    )
}

export default Index