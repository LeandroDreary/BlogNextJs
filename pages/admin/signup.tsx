import React from 'react'
import Head from 'next/head'
import Cookies from 'cookies'
import getRawBody from 'raw-body'
import bcrypt from 'bcryptjs'
import validator from 'validator'
import { GetServerSideProps } from 'next'
import '../../components/LoadClasses'
import dbConnect, { Auth, User } from '../../database/connection'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const cookies = new Cookies(req, res)
    let warnings = []

    let { user_agent, ip, auth } = {
        user_agent: req.headers['user-agent'],
        ip: req.connection.remoteAddress || req.connection.localAddress,
        auth: cookies.get('auth')
    }
    const url = new URL(`${process.env.API_URL}/?` + (await getRawBody(req)).toString("utf-8"));
    const { username, email, password } = { username: url.searchParams.get("username"), email: url.searchParams.get("email"), password: url.searchParams.get("password") }

    await dbConnect()

    if (req.method !== "GET" && req.method !== "DELETE") {
        if (validator.isEmpty(username))
            warnings.push({ input: "username", message: "Nome de usuário não pode estar vazio." })
        if (!validator.isLength(username, { min: 3 }))
            warnings.push({ input: "username", message: "Nome de usuário precisa ter no minimo 3 caracteres." })
        if (!validator.isLength(username, { max: 15 }))
            warnings.push({ input: "username", message: "Nome de usuário pode ter no maximo 15 caracteres." })

        if (validator.isEmpty(password))
            warnings.push({ input: "password", message: "Senha não pode estar vazia." })
        if (!validator.isLength(password, { min: 8 }))
            warnings.push({ input: "password", message: "Senha precisa ter no minimo 8 caracteres." })
        if (!validator.isLength(password, { max: 30 }))
            warnings.push({ input: "password", message: "Senha pode ter no maximo 30 caracteres." })

        if (validator.isEmpty(email))
            warnings.push({ input: "email", message: "Email não pode estar vazia." })
        if (!validator.isEmail(email))
            warnings.push({ input: "email", message: "Formato de email inválido." })
    }

    console.log(req.method)

    switch (req.method) {
        case "POST":
            cookies.set('auth')

            if ((await User.find({ username }).collation({ locale: "en", strength: 1 }).exec()).length > 0)
                warnings.push({ input: "username", message: "Nome de usuário já em uso" })
            if ((await User.find({ email }).collation({ locale: "en", strength: 1 }).exec()).length > 0)
                warnings.push({ input: "email", message: "Email já em uso" })

            if (warnings.length <= 0) {
                let user = await (new User({ username, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) })).save();
                if (!auth)
                    auth = (await (new Auth({ ip, user_agent, user: user._id })).save())._id;
                cookies.set('auth', String(auth))
            }
            break;
    }

    if (auth || (await User.find({}).exec()).length <= 0) {
        return {
            props: {
                warnings,
                inputs: { username, email }
            }
        }
    }
    else {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

}

const Index = ({ warnings, inputs }) => {

    return (
        <div>
            <Head>
            </Head>
            <div className="container h-screen flex justify-center items-center mx-auto">
                <form method="post" className="bg-white  shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col" >
                    <div className="mb-4">
                        <label className="block text-grey-400 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input defaultValue={inputs.username} name="username" className="shadow appearance-none border rounded w-64 py-2 px-3 text-grey-400" type="text" placeholder="username" />
                        {
                            warnings.map(warning => {
                                if (warning.input === "username")
                                    return <p className="text-red-400 text-xs italic font-bold my-1">{warning.message}</p>
                            })
                        }
                    </div>
                    <div className="mb-4">
                        <label className="block text-grey-400 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input defaultValue={inputs.email} name="email" className="shadow appearance-none border rounded w-64 py-2 px-3 text-grey-400" type="email" placeholder="email" />
                        {
                            warnings.map(warning => {
                                if (warning.input === "email")
                                    return <p className="text-red-400 text-xs italic font-bold my-1">{warning.message}</p>
                            })
                        }
                    </div>
                    <div className="mb-6">
                        <label className="block text-grey-400 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input name="password" className="shadow appearance-none border border-red rounded w-64 py-2 px-3 text-grey-400 mb-3" type="password" placeholder="*********" />
                        {
                            warnings.map(warning => {
                                if (warning.input === "password")
                                    return <p className="text-red-400 text-xs italic font-bold my-1">{warning.message}</p>
                            })
                        }
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Index
