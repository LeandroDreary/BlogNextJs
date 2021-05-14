import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Cookies from 'cookies'
import Api from '../../../services/api'
import Navbar from './../../../components/navbar_admin_area'
import '../../../components/LoadClasses'
import { GetServerSideProps } from 'next'
import bcrypt from 'bcryptjs'
import Navigation from '../../../components/navigation'
import Link from 'next/link';
import DbConnect, { Config } from '../../../database/connection'
import { FaSearch } from 'react-icons/fa'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    await DbConnect()
    const cookies = new Cookies(req, res)
    let info = null
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

    const [users, setUsers] = useState<{ _id: string, username: string, discordUser: string }[]>()
    const [filters, setFilters] = useState<{ perPage: number, page: number, pages: number, search: string, category: string }>({ search: "", page: 1, pages: 0, category: undefined, perPage: 12 })
    const [loading, setLoading] = useState<boolean>(false);

    const LoadUsers = (page?: number, perPage?: number, search?: string) => {
        setLoading(true)
        Api.get(`/api/user/list?${`page=${page || filters.page || 1}&`
            }${`perPage=${perPage || filters.perPage || 1}&`
            }${(search || filters.search) ? `search=${search || filters.search || ""}` : ""
            }`, { withCredentials: true }).then(response => {
                setUsers(response.data?.result)
                setFilters({ ...filters, ...response.data })
                setLoading(false)
            })
    }
    useEffect(() => {
        LoadUsers()
    }, [])

    return (
        <>
            <Head>
            </Head>
            <Navbar info={info} user={user} />
            <div className="container mx-auto">
                <div className="grid grid-cols-12">
                    <div className="col-span-12">
                        <Link href="/AdminArea/users/create">
                             <a>
                                <button className={`mr-5 my-4 bg-${info?.colors.background?.color} hover:bg-${info?.colors.background?.shadow} text-${info?.colors.text?.shadow} hover:text-${info?.colors.text?.color} font-bold py-2 px-6 rounded-lg`}>
                                    Create
                                </button>
                            </a>
                        </Link>
                        <button onClick={() => LoadUsers()} className="mr-5 my-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg">
                            Reload
                        </button>
                        <hr />
                    </div>
                </div>
                <div className="box pt-6">
                    <form onSubmit={(e) => { e.preventDefault(); LoadUsers(); }}>
                        <div className={`bg-${info?.colors.background?.color} py-4 px-6 mx-4 rounded-lg shadow-md box-wrapper`}>
                            <div className={`rounded flex items-center w-full p-3 shadow-sm border border-${info?.colors?.text?.color} text-${info?.colors?.text?.color}`}>
                                <input onChange={e => setFilters({ ...filters, search: e.target.value })} type="search" placeholder="search" x-model="q" className={`placeholder-${info?.colors?.text?.shadow} font-semibold w-full text-sm outline-none focus:outline-none bg-transparent`} />
                                <button type="submit" className="outline-none focus:outline-none px-4">
                                    <FaSearch />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="grid grid-cols-6">
                    <div className="col-span-6">
                        <Navigation callBack={page => LoadUsers(page)} info={info} page={filters.page} pages={filters.pages} />
                        <hr />
                    </div>
                    <div className="col-span-1">
                    </div>
                    <div className="col-span-6 sm:col-span-4 mx-4">
                        {!loading ?
                            users?.map(user => {
                                return (
                                    <div className="grid grid-cols-4 shadow border my-4 rounded" key={user._id}>
                                        <div className="col-span-1 text-2xl text-gray-700 font-semibold text-center p-4">
                                            {user.username}
                                        </div>
                                        <div className="col-span-1 text-2xl text-gray-700 font-semibold text-center p-4">
                                            {user.discordUser}
                                        </div>
                                        <div className="col-span-2">
                                        </div>
                                    </div>
                                )
                            }) :
                            <div className="flex justify-center items-center h-64">
                                <img src="https://www.wallies.com/filebin/images/loading_apple.gif" alt="loading" className="w-12" />
                            </div>
                        }
                    </div>
                    <div className="col-span-6">
                        <hr />
                        <Navigation callBack={page => LoadUsers(page)} info={info} page={filters.page} pages={filters.pages} />
                    </div>
                </div>
            </div>
        </>
    )


}

export default Index