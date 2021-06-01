import React, { useState } from 'react'
import Head from 'next/head'
import Cookies from 'cookies'
import Navbar from '../../components/navbar_admin_area'
import '../../components/LoadClasses'
import bcrypt from 'bcryptjs'
import { GetServerSideProps } from 'next'
import { Config } from '../../database/models'
import DbConnect from './../../utils/dbConnect'
import ReactHtmlParser from 'react-html-parser'
import Frm_Info from './../../components/forms/config/frm_info'
import Frm_HomePageInfo from './../../components/forms/config/frm_homePageInfo'

interface info {
    websiteName: string,
    description: string,
    keywords: string,
    icon: string,
    iconICO: string,
    colors: {
        background: {
            shadow: string,
            color: string
        },
        text: {
            shadow: string,
            color: string
        }
    },
    customLayoutStyles: string,
    customLayout: {
        colors: {
            background: {
                shadow: string,
                color: string
            },
            text: {
                shadow: string,
                color: string
            }
        }
    }
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    await DbConnect()
    const cookies = new Cookies(req, res)
    let Info = null
    let HomePageInfo = null
    try {
        Info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
        Info = Info._doc.content
    } catch (e) { }

    try {
        HomePageInfo = await Config.findOne({ name: "homePageInfo" }).select(`-_id`).exec()
        HomePageInfo = HomePageInfo._doc.content
    } catch (e) { }

    if (bcrypt.compareSync(`${process.env.ADMINPASSWORD}_${process.env.ADMINUSERNAME}`, cookies.get('AdminAreaAuth'))) {
        return {
            props: {
                Info,
                user: { username: process.env.ADMINUSERNAME },
                HomePageInfo
            }
        }
    } else {
        return {
            redirect: {
                destination: '/AdminArea',
                permanent: false,
            }
        }
    }
}

const Index = ({ Info, user, HomePageInfo }) => {

    const [infoInputs, setInfoInputs] = useState<info>(Info)    

    return (
        <>
            <Head>
                <title>Configurações - {infoInputs?.websiteName}</title>
                <link rel="stylesheet" href="/css/admin/config.css" />
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
                {ReactHtmlParser(infoInputs?.customLayoutStyles)}
            </Head>
            <Navbar info={infoInputs} user={user} />
            <div className="container py-4 mx-auto">
                
                <Frm_Info Info={Info} infoInputs={infoInputs} setInfoInputs={setInfoInputs} />

                <Frm_HomePageInfo info={infoInputs} homePageInfo={HomePageInfo} />

            </div>
        </>
    )

}

export default Index