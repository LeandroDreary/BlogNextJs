import React, { useEffect, useState } from 'react'
import LayoutAdminArea from './../../../layout/layoutAdminArea'
import Cookies from 'cookies'
import Api from './../../../services/api'
import { PostCardAdmin, Navigation } from '../../../components'
import { FaSearch } from 'react-icons/fa'
import { GetServerSideProps } from 'next'
import bcrypt from 'bcryptjs'
import { Config } from '../../../database/models'
import DbConnect from './../../../utils/dbConnect'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    await DbConnect()
    const cookies = new Cookies(req, res)
    let { info, user } = { info: null, user: null }
    try {
        info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
        info = info._doc.content
    } catch (e) { }

    if (bcrypt.compareSync(`${process.env.ADMINPASSWORD}_${process.env.ADMINUSERNAME}`, (cookies.get('AdminAreaAuth') || ""))) {
        return {
            props: {
                info,
                user: { username: process.env.ADMINUSERNAME }
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

const Index = ({ info, user }) => {
    const [posts, setPosts] = useState<{ title: string, description: string, image: string, link: string }[]>()
    const [filters, setFilters] = useState<{ perPage: number, page: number, pages: number, search: string, category: string }>({ search: "", page: 1, pages: 0, category: undefined, perPage: 12 })
    const [loading, setLoading] = useState<boolean>(false);

    const LoadPost = (page?: number, perPage?: number, q?: string) => {
        setLoading(true)
        Api.get(`/api/post/list?authorFilter=true&select=title%20description%20image%20link&${`page=${page || filters.page || 1}&`
            }${`perPage=${perPage || filters.perPage || 12}&`
            }${`authenticate=true&`
            }${(q || filters.search) ? `search=${q || filters.search || ""}` : ""
            }`, { withCredentials: true }
        ).then(response => {
            setPosts(response.data?.result);
            setLoading(false);
            setFilters({ ...filters, ...response.data })
        })
    }

    useEffect(() => {
        LoadPost()
    }, [])


    return (
        <>
            <LayoutAdminArea head={<title>Posts</title>} info={info} user={user}>
                <div className="container mx-auto">
                    <div className="grid grid-cols-12">
                        <div className="col-span-12">
                            <a href="/admin/post/create">
                                <button className={`mr-5 my-4 bg-${info?.colors.background?.color} hover:bg-${info?.colors.background?.shadow} text-${info?.colors.text?.shadow} hover:text-${info?.colors.text?.color} font-bold py-2 px-6 rounded-lg`}>
                                    Novo post
                            </button>
                            </a>
                            <button onClick={() => LoadPost()} className="mr-5 my-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg">
                                Recarregar
                        </button>
                            <hr />
                        </div>
                        <div className="box pt-6 col-span-12">
                            <form onSubmit={(e) => { e.preventDefault(); LoadPost(); }}>
                                <div className={`bg-${info?.colors.background?.color} py-4 px-6 mx-4 rounded-lg shadow-md box-wrapper`}>
                                    <div className={`rounded flex items-center w-full p-3 shadow-sm border border-${info?.colors?.text?.color} text-${info?.colors?.text?.color}`}>
                                        <input onChange={e => setFilters({ ...filters, search: e.target.value })} type="search" placeholder="Procurar" x-model="q" className={`placeholder-${info?.colors?.text?.shadow} font-semibold w-full text-sm outline-none focus:outline-none bg-transparent`} />
                                        <button type="submit" className="outline-none focus:outline-none px-4">
                                            <FaSearch />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="col-span-12">
                            <Navigation callBack={page => LoadPost(page)} info={info} page={filters.page} pages={filters.pages} />
                            <hr />
                        </div>
                        <div className="col-span-1"></div>
                        <div className="col-span-12 sm:col-span-10 mx-auto">

                            {!loading ? posts?.map((post, index) => {
                                return <PostCardAdmin info={info} reload={LoadPost} description={post.description} image={post.image} link={post.link} title={post.title} key={index} />
                            }) :
                                <div className="flex justify-center items-center h-64">
                                    <img src="https://www.wallies.com/filebin/images/loading_apple.gif" alt="loading" className="w-12" />
                                </div>
                            }
                        </div>
                        <div className="col-span-1"></div>
                        <div className="col-span-12">
                            <hr />
                            <Navigation callBack={page => LoadPost(page)} info={info} page={filters.page} pages={filters.pages} />
                        </div>
                    </div>
                </div>
            </LayoutAdminArea>
        </>
    )

}

export default Index