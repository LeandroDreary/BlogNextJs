import React, { useState } from 'react'
import LayoutAdminArea from './../../layout/layoutAdminArea'
import Cookies from 'cookies'
import bcrypt from 'bcryptjs'
import { GetServerSideProps } from 'next'
import { Config } from '../../database/models'
import DbConnect from './../../utils/dbConnect'
import WebsiteConfig from '../../components/forms/websiteConfig'
import HomePage from '../../components/forms/homePage'
import { PagesInfoI } from '../../services/types'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    await DbConnect()
    const cookies = new Cookies(req, res)
    let Info = null
    let HomePageInfo = null
    try {
        Info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
    } catch (e) { }

    try {
        HomePageInfo = await Config.findOne({ name: "homePageInfo" }).select(`-_id`).exec()
    } catch (e) { }

    console.log(HomePageInfo.toJSON().content)

    if (bcrypt.compareSync(`${process.env.ADMINPASSWORD}_${process.env.ADMINUSERNAME}`, cookies.get('AdminAreaAuth'))) {
        return {
            props: {
                Info: Info.toJSON().content,
                user: { username: process.env.ADMINUSERNAME },
                HomePageInfo: HomePageInfo.toJSON().content
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

    const [infoInputs, setInfoInputs] = useState<PagesInfoI>(Info)

    return (
        <>
            <LayoutAdminArea head={<><title>Configurações - {infoInputs?.websiteName}</title>
                <link rel="stylesheet" href="/css/admin/config.css" /> <style>
                    {`
            @keyframes slideInFromLeft {
              0% {
                transform: translateY(-20%);
                opacity: 0.7;
              }
              100% {
                transform: translateY(0);
                opacity: 1;
              }
            }
            .slide-up { 
              animation: 0.25s ease-out 0s 1 slideInFromLeft;
            }
            
            `}
                </style></>} info={infoInputs} user={user}>
                <div className="container py-4 mx-auto">

                    <WebsiteConfig Info={Info} infoInputs={infoInputs} setInfoInputs={setInfoInputs} />

                    <HomePage info={infoInputs} homePageInfo={HomePageInfo} />

                </div>
            </LayoutAdminArea>
        </>
    )

}

export default Index