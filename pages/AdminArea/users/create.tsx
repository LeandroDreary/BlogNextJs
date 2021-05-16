import React, { useState } from 'react'
import Head from 'next/head'
import Cookies from 'cookies'
import getRawBody from 'raw-body'
import Navbar from './../../../components/navbar_admin_area'
import '../../../components/LoadClasses'
import { GetServerSideProps } from 'next'
import bcrypt from 'bcryptjs'
import DbConnect, { Config, User } from '../../../database/connection'
import Link from 'next/link'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    await DbConnect()
    let warnings = []
    const cookies = new Cookies(req, res)
    let info = null

    const url = new URL(`${process.env.API_URL}/?` + (await getRawBody(req)).toString("utf-8"));
    const { username, discordUser, password } = { username: url.searchParams.get("username"), discordUser: url.searchParams.get("discordUser"), password: url.searchParams.get("password") }

    try {
        info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
        info = info._doc.content
    } catch (e) { }

    if ((await User.find({ username }).collation({ locale: "en", strength: 2 }).exec()).length > 0)
        warnings.push({ message: "Usuário já existe.", input: "username" })

    if (warnings.length <= 0)
        switch (req.method) {
            case "POST":
                await (new User({ username, activated: true, discordUser, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) })).save()
                return {
                    redirect: {
                        destination: '/AdminArea/users',
                        permanent: false,
                    }
                }
                break;
        }

    if (bcrypt.compareSync(`${process.env.ADMINPASSWORD}_${process.env.ADMINUSERNAME}`, (cookies.get('AdminAreaAuth') || ""))) {
        return {
            props: {
                info,
                user: { username: process.env.ADMINUSERNAME },
                warnings,
                inputs: { username, discordUser }
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

const Index = ({ info, user, warnings, inputs }) => {

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
                                    <input defaultValue={inputs?.username} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="username" id="username" type="text" placeholder="Username" />
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
                                    <input defaultValue={inputs?.discordUser} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="discordUser" id="discordUser" type="text" placeholder="Discord" />
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