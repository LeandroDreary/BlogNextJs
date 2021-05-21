import React, { useState, useRef } from 'react'
import Head from 'next/head'
import Cookies from 'cookies'
import Navbar from './../../components/navbar_admin'
import '../../components/LoadClasses'
import { GetServerSideProps } from 'next'
import HandleAuth from '../../services/auth'
import DbConnect, { Config } from '../../database/connection'
import Api from './../../services/api'
import FormData from 'form-data'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    await DbConnect()
    const cookies = new Cookies(req, res)
    let { info, user } = { info: null, user: null }

    try {
        info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
        info = info._doc.content
    } catch (e) { }

    user = await HandleAuth(cookies.get("auth") || "na")

    if (user?.username) {
        return {
            props: {
                info,
                User: {
                    _id: user?._id.toString(),
                    username: user?.username || null,
                    discordUser: user?.discordUser || null,
                    password: user?.password || null,
                    image: user?.image || null
                },
            }
        }
    } else {
        cookies.get("set")
        return {
            redirect: {
                destination: '/admin/signin',
                permanent: false,
            }
        }
    }
}

const Index = ({ info, User }) => {
    console.log(User)
    const [user, setUser] = useState(User)
    const { username, discordUser, password } = { username: useRef<HTMLInputElement>(), discordUser: useRef<HTMLInputElement>(), password: useRef<HTMLInputElement>() }
    const [warnings, setWarnings] = useState<{ message: string; input: string, success?: boolean }[]>([])
    const [imageFile, setImageFile] = useState<{ preview: any; file: File }>({
        preview: user?.image || undefined,
        file: undefined
    })

    const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let data = new FormData();

        data.append('image', imageFile?.file || user?.image || "");
        data.append('username', username.current.value);
        data.append('discordUser', discordUser.current.value);
        data.append('password', password.current.value);

        Api.put("/api/user", data, { headers: { 'content-type': 'multipart/form-data' } }).then(res => {
            setWarnings(res.data?.warnings || [])
            setUser(res.data?.result || user)
        })
    }

    return (
        <>
            <Head>
            </Head>
            <Navbar info={info} user={user} />
            <div className="container mx-auto px-3 md:px-0">
                <form onSubmit={HandleSubmit}>
                    <div className="w-full grid grid-cols-6 gap-4">
                        <div className="col-span-1">
                        </div>
                        <div className="col-span-6 md:col-span-4">
                            {
                                warnings?.map(warning => {
                                    if (warning?.success)
                                        return <p key={warning.message} className="text-green-600 bg-green-100 px-4 py-2 rounded ring-1 text-sm ring-green-700 text-center font-semibold mt-4">{warning.message}</p>
                                    else
                                        return <p key={warning.message} className="text-red-600 bg-red-100 px-4 py-2 rounded ring-1 text-sm ring-red-700 text-center font-semibold mt-4">{warning.message}</p>
                                })
                            }
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-6 gap-4">
                        <div className="col-span-1">
                        </div>
                        <div className="col-span-6 md:col-span-4">
                            <div className="my-4">
                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Username</span>
                                </div>
                                <div className="p-4 border shadow-md">
                                    <input defaultValue={user?.username || ""} ref={username} className="placeholder-gray-300 text-gray-600 shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="username" id="username" type="text" placeholder="Username" />
                                    {
                                        warnings?.map(warning => {
                                            if (warning.input === "username")
                                                return <p key={warning.message} className="text-red-400 text-xs italic font-bold my-1">{warning.message}</p>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-6 gap-4">
                        <div className="col-span-1">
                        </div>
                        <div className="col-span-6 md:col-span-4">
                            <div className="my-4">
                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Discord</span>
                                </div>
                                <div className="p-4 border shadow-md">
                                    <input defaultValue={user?.discordUser || ""} ref={discordUser} className="placeholder-gray-300 text-gray-600 shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="discordUser" id="discordUser" type="text" placeholder="Discord" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-6 gap-4">
                        <div className="col-span-1">
                        </div>
                        <div className="col-span-6 md:col-span-4">
                            <div className="my-4">
                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4 `}>
                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Image</span>
                                </div>
                                <div className="p-4">
                                    <label aria-label="Banner">
                                        <input className="hidden" onChange={e => setImageFile({ preview: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : undefined, file: e.target.files[0] })} type="file" id="file" name="icon" accept="image/x-png,image/jpeg,image/webp" />
                                        <div className="pb-4">
                                            <span className={`bg-${info?.colors?.background?.color} mt-4 hover:bg-${info?.colors?.background?.shadow} rounded px-4 py-2 text-${info?.colors?.text?.shadow} hover:text-${info?.colors?.text?.color} font-semibold`}>Choose Banner</span>
                                        </div>

                                        <div style={{ maxWidth: "25em" }} className={`w-full h-44 p-4 bg-${info?.colors?.background?.color} shadow-lg border border-${info?.colors?.background?.shadow}`}>
                                            {imageFile.preview ?
                                                <img id="icon-img" alt="icon" src={imageFile?.preview} className={`mx-auto shadow-lg h-full`} />
                                                :
                                                <div>

                                                </div>
                                            }
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-6 gap-4">
                        <div className="col-span-1">
                        </div>
                        <div className="col-span-6 md:col-span-4">
                            <div className="my-4">
                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Password</span>
                                </div>
                                <div className="p-4 border shadow-md">
                                    <input ref={password} className="placeholder-gray-300 text-gray-600 shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="password" id="password" type="password" placeholder="Password" />
                                </div>
                                {
                                    warnings?.map(warning => {
                                        if (warning.input === "password")
                                            return <p key={warning.message} className="text-red-400 text-xs italic font-bold my-1">{warning.message}</p>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-6 gap-4">
                        <div className="col-span-1">
                        </div>
                        <div className="col-span-6 md:col-span-4">
                            {
                                warnings?.map(warning => {
                                    if (warning?.success)
                                        return <p key={warning.message} className="text-green-600 bg-green-100 px-4 py-2 rounded ring-1 text-sm ring-green-700 text-center font-semibold mt-4">{warning.message}</p>
                                })
                            }
                        </div>
                    </div>
                    <div className="text-center">
                        <button type="submit" className={`mr-5 my-4 bg-${info?.colors.background?.color} hover:bg-${info?.colors.background?.shadow} text-${info?.colors.text?.shadow} hover:text-${info?.colors.text?.color} font-bold py-2 px-6 rounded-lg`}>
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </>
    )


}


export default Index