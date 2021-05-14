import React, { useState } from 'react'
import Head from 'next/head'
import Cookies from 'cookies'
import Navbar from './../../../components/navbar_admin_area'
import '../../../components/LoadClasses'
import { GetServerSideProps } from 'next'
import bcrypt from 'bcryptjs'
import DbConnect, { Config } from '../../../database/connection'
import Link from 'next/link'

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

    const [password, setPassword] = useState<string>(Math.random().toString(36).slice(-8))

    return (
        <>
            <Head>
            </Head>
            <Navbar info={info} user={user} />
            <div className="container mx-auto">
                <Link href="/AdminArea/users">
                    <a>
                        <button className={`mr-5 my-4 bg-${info?.colors.background?.color} hover:bg-${info?.colors.background?.shadow} text-${info?.colors.text?.shadow} hover:text-${info?.colors.text?.color} font-bold py-2 px-6 rounded-lg`}>
                            Turn back
                        </button>
                    </a>
                </Link>
                <hr />
                <form method="post">
                    <div className="w-full grid grid-cols-6 gap-4">
                        <div className="col-span-1">
                        </div>
                        <div className="col-span-4">
                            <div className="my-4">
                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Username</span>
                                </div>
                                <div className="p-4 border shadow-md">
                                    <input className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="username" id="username" type="text" placeholder="Username" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-6 gap-4">
                        <div className="col-span-1">
                        </div>
                        <div className="col-span-4">
                            <div className="my-4">
                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Discord</span>
                                </div>
                                <div className="p-4 border shadow-md">
                                    <input className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="discord" id="discord" type="text" placeholder="Discord" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-6 gap-4">
                        <div className="col-span-1">
                        </div>
                        <div className="col-span-4">
                            <div className="my-4">
                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Password</span>
                                </div>
                                <div className="p-4 border shadow-md">
                                    <button type="button" onClick={() => setPassword(Math.random().toString(36).slice(-8))} className={`mr-5 mb-4 bg-${info?.colors.background?.color} hover:bg-${info?.colors.background?.shadow} text-${info?.colors.text?.shadow} hover:text-${info?.colors.text?.color} font-bold py-2 px-6 rounded-lg`}>
                                        Generate Password
                                    </button>
                                    <input value={password} onChange={e => setPassword(e.target.value)} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="password" id="password" type="text" placeholder="Password" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <button type="submit" className={`mr-5 my-4 bg-${info?.colors.background?.color} hover:bg-${info?.colors.background?.shadow} text-${info?.colors.text?.shadow} hover:text-${info?.colors.text?.color} font-bold py-2 px-6 rounded-lg`}>
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </>
    )


}

export default Index