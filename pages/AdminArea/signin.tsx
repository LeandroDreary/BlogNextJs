import React from 'react'
import Head from 'next/head'
import Cookies from 'cookies'
import getRawBody from 'raw-body'
import bcrypt from 'bcryptjs'
import '../../components/LoadClasses'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const cookies = new Cookies(req, res)
    let warnings = []
    let auth = cookies.get('AdminAreaAuth') || ""
    const url = new URL(`${process.env.API_URL}/?` + (await getRawBody(req)).toString("utf-8"));
    const { username, password } = { username: url.searchParams.get("username"), password: url.searchParams.get("password") }

    switch (req.method) {
        case "POST":
            cookies.set('AdminAreaAuth')
            if (process.env.ADMINUSERNAME === username && process.env.ADMINPASSWORD === password) {
                auth = bcrypt.hashSync(`${password}_${username}`, bcrypt.genSaltSync(10))
                cookies.set('AdminAreaAuth', auth)
            }
            else {
                warnings.push({ message: "Dados incorretos.", input: "password" })
            }
            break;
    }

    if (bcrypt.compareSync(`${process.env.ADMINPASSWORD}_${process.env.ADMINUSERNAME}`, auth)) {

        return {
            redirect: {
                destination: '/AdminArea',
                permanent: false,
            }
        }
    }
    else {
        cookies.set('AdminAreaAuth')
        return {
            props: {
                warnings,
                inputs: { username:username || "" }
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
                {/* <Login /> */}
                <form method="post" className="bg-white shadow-md rounded px-8 pt-6 pb-8 flex flex-col">
                    <div className="mb-4">
                        <label className="block text-grey-400 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input className="shadow w-64 appearance-none border rounded py-2 px-3 text-grey-400" defaultValue={inputs.username} type="text" name="username" placeholder="username" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-grey-400 text-sm font-bold mb-2" htmlFor="password">
                            Password
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
