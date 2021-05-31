import React from 'react'
import Head from 'next/head'
import Cookies from 'cookies'
import Navbar from './../../components/navbar_admin_area'
import '../../components/LoadClasses'
import { GetServerSideProps } from 'next'
import bcrypt from 'bcryptjs'
import { Config } from '../../database/models'
import DbConnect from './../../utils/dbConnect'
import ReactHtmlParser from 'react-html-parser'

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

    return (
        <>
            <Head>
                <title>Página Inicial</title>
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
                {ReactHtmlParser(info?.customLayoutStyles)}
            </Head>
            <Navbar info={info} user={user} />
            <div className="container">

            </div>
        </>
    )


}

export default Index