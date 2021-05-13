import React from 'react'
import Head from 'next/head'
import Cookies from 'cookies'
import Navbar from './../../components/navbar_admin'
import '../../components/LoadClasses'
import { GetServerSideProps } from 'next'
import HandleAuth from '../../services/auth'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const cookies = new Cookies(req, res)
    let { info, user } = { info: null, user: null }
    try {
        info = (await (await fetch(process.env.API_URL + '/api/config?name=info')).json())?.result?.content
    } catch (e) { }

    user = await HandleAuth(cookies.get("auth") || "na")

    return {
        props: {
            info,
            user: { username: user.username, email: user.email }
        }
    }
}

const Index = ({ info, user }: { info: any, user: any }) => {

    return (
        <>
            <Head>
            </Head>
            <Navbar info={info} user={user} />
            <div className="container">

            </div>
        </>
    )


}

export default Index