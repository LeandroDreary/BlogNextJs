import React from 'react'
import Head from 'next/head'
import Cookies from 'cookies'
import getRawBody from 'raw-body'
import mongoose from "mongoose"
import bcrypt from 'bcryptjs'
import '../../components/LoadClasses'
import { GetServerSideProps, } from 'next'
import { Auth, AuthI, User, UserI } from '../../database/models'
import DbConnect from './../../utils/dbConnect'
import HandleAuth from '../../services/auth'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const cookies = new Cookies(req, res)
    let warnings = []
    let { user_agent, ip, auth } = {
        user_agent: req.headers['user-agent'],
        ip: req.connection.remoteAddress || req.connection.localAddress,
        auth: cookies.get('auth')
    }
    const url = new URL(`${process.env.API_URL}/?` + (await getRawBody(req)).toString("utf-8"));
    const { username, password } = { username: url.searchParams.get("username"), password: url.searchParams.get("password") }

    await DbConnect()

    switch (req.method) {
        case "POST":
            cookies.set('auth')

            let user: mongoose.Document & UserI = await User.findOne({ username }).exec();
            if (!user?.username) {
                warnings.push({ message: "Usuário não encontrado", input: "username" })
            }
            else {
                if (bcrypt.compareSync(password, user.password)) {
                    let authInfo: AuthI = { ip, user_agent, user: user._id }
                    auth = (await (new Auth(authInfo)).save())._id;
                    cookies.set('auth', String(auth))
                } else {
                    warnings.push({ message: "Senha incorreta.", input: "password" })
                }
            }
            break;
    }

    let user = await HandleAuth(auth)

    if (user?.username) {
        return {
            redirect: {
                destination: '/admin',
                permanent: false,
            }
        }

    }
    else {
        cookies.set('auth')
        return {
            props: {
                warnings,
                inputs: { username }
            }
        }
    }

}

const Index = ({ warnings, inputs }) => {

    return (
        <div>
            <Head>
                <title>Entrar</title>
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
            </Head>
            <div className="container h-screen flex justify-center items-center mx-auto">
                {/* <Login /> */}
                <form method="post" className="bg-white shadow-md rounded px-8 pt-6 pb-8 flex flex-col">
                    <div className="mb-4">
                        <label className="block text-grey-400 text-sm font-bold mb-2" htmlFor="username">
                            Usuário:
                        </label>
                        <input className="shadow w-64 appearance-none border rounded py-2 px-3 text-grey-400" defaultValue={inputs.username} type="text" name="username" placeholder="Usuário" />
                        {
                            warnings.map(warning => {
                                if (warning.input === "username")
                                    return <p className="text-red-400 text-xs italic font-bold my-1">{warning.message}</p>
                            })
                        }
                    </div>
                    <div className="mb-6">
                        <label className="block text-grey-400 text-sm font-bold mb-2" htmlFor="password">
                            Senha:
                        </label>
                        <input className="shadow w-64 appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" type="password" name="password" placeholder="*********" />
                        {
                            warnings.map(warning => {
                                if (warning.input === "password")
                                    return <p className="text-red-400 text-xs italic font-bold my-1">{warning.message}</p>
                            })
                        }
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
                            Sign In
                    </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Index
