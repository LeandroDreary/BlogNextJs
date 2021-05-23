import React from 'react'
import Head from 'next/head'
import Cookies from 'cookies'
import Navbar from './../../components/navbar_admin'
import '../../components/LoadClasses'
import { GetServerSideProps } from 'next'
import HandleAuth from '../../services/auth'
import DbConnect, { Config } from '../../database/connection'
import ReactHtmlParser from 'react-html-parser'

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
                user: { username: user.username }
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

const Index = ({ info, user }: { info: any, user: any }) => {

    return (
        <>
            <Head>
                <title>Página Inicial</title>
                {ReactHtmlParser(info?.customLayoutStyles)}
            </Head>
            <Navbar info={info} user={user} />
            <div className="container">

            </div>
        </>
    )


}

export default Index