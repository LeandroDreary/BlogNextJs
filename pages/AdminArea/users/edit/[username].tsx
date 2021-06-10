import React, { useEffect, useState } from 'react'
import LayoutAdminArea from './../../../../layout/layoutAdminArea'
import Api from '../../../../services/api'
import { GetStaticProps } from 'next'
import { Config, UserI } from "../../../../database/models"
import DbConnect from './../../../../utils/dbConnect'
import Link from 'next/link'
import Router from 'next/router'

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: true,
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    DbConnect()
    let { info } = { info: null }

    try {
        info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
        info = info._doc.content
    } catch (e) { }

    return {
        props: {
            info,
            username: context.params.username
        },
        revalidate: 1
    }
}

function Blog({ info, username }) {
    const [userF, setUserF] = useState<UserI>()
    const [user, setUser] = useState<{ username: string }>()
    const [password, setPassword] = useState<string>()
    const [warnings, setWarnings] = useState<{ message: string, input: string }[]>([])

    const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWarnings([])
        await Api.put(`/api/user`, userF, { withCredentials: true }).then(response => {
            setWarnings(response.data?.warnings || [])
        })
        if (warnings.length <= 0)
            Router.push("/AdminArea/users")
    }

    useEffect(() => {
        if (username) {
            Api.get(`/api/user?username=${username}`, { withCredentials: true }).then(response => { setUserF(response.data?.result) })
        }
    }, [username])

    useEffect(() => {
        Api.get(`/api/AdminAreaAuth`, { withCredentials: true }).then(response => { setUser(response.data) })
    }, [])

    return (
        <>
            <LayoutAdminArea head={<title>Editar usuário - {username?.title}</title>} info={info} user={user}>
                <div className="container mx-auto">
                    <div>
                        <Link href="/AdminArea/users">
                            <a>
                                <button className={`mr-5 bg-${info?.colors?.background?.color} hover:bg-${info?.colors?.background?.shadow} text-${info?.colors?.text?.shadow} hover:text-${info?.colors?.text?.color} m-4 font-bold py-2 px-6 rounded-lg`}>
                                    Back
                            </button>
                            </a>
                        </Link>
                    </div>
                    <hr />
                    <div>
                        {userF?._id ?
                            <>
                                <form onSubmit={HandleSubmit} method="put">
                                    <div className="w-full grid grid-cols-6 gap-4">
                                        <div className="col-span-1">
                                        </div>
                                        <div className="col-span-4">
                                            <div className="my-4">
                                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Username</span>
                                                </div>
                                                <div className="p-4 border shadow-md">
                                                    <input onChange={e => setUserF({ ...userF, username: e.target.value })} defaultValue={userF?.username} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="username" id="username" type="text" placeholder="Username" />
                                                    {
                                                        warnings.map(warning => {
                                                            if (warning.input === "username")
                                                                return <p className="text-red-400 text-xs italic font-bold my-1">{warning.message}</p>
                                                        })
                                                    }
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
                                                    <input onChange={e => setUserF({ ...userF, discordUser: e.target.value })} defaultValue={userF?.discordUser} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="discordUser" id="discordUser" type="text" placeholder="Discord" />
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
                                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>activated</span>
                                                </div>
                                                <div className="p-4 border shadow-md">
                                                    <input type="checkbox" onChange={e => setUserF({ ...userF, activated: e.target.checked })} checked={userF?.activated} className="shadow border border-red rounded py-2 px-3 text-grey-400 mb-3" name="activated" id="activated" placeholder="activated" />
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
                                                    <button type="button" onClick={() => { let p = Math.random().toString(36).slice(-8); setUserF({ ...userF, password: p }); setPassword(p) }} className={`mr-5 mb-4 bg-${info?.colors.background?.color} hover:bg-${info?.colors.background?.shadow} text-${info?.colors.text?.shadow} hover:text-${info?.colors.text?.color} font-bold py-2 px-6 rounded-lg`}>
                                                        Generate Password
                                                </button>
                                                    <input onChange={e => { setPassword(e.target.value); setUserF({ ...userF, password: e.target.value }) }} value={password} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="password" id="password" type="text" placeholder="Password" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className={`mr-5 my-4 bg-${info?.colors.background?.color} hover:bg-${info?.colors.background?.shadow} text-${info?.colors.text?.shadow} hover:text-${info?.colors.text?.color} font-bold py-2 px-6 rounded-lg`}>
                                            Save
                                </button>
                                    </div>
                                </form>
                            </>
                            : <div className="flex justify-center items-center h-64">
                                <img src="https://www.wallies.com/filebin/images/loading_apple.gif" alt="loading" className="w-12" />
                            </div>}
                    </div>
                </div>
            </LayoutAdminArea>
        </>)

}



export default Blog