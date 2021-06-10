import React from 'react'
import Cookies from 'cookies'
import LayoutAdminArea from './../../layout/layoutAdminArea'
import { GetServerSideProps } from 'next'
import bcrypt from 'bcryptjs'
import { Config } from '../../database/models'
import DbConnect from './../../utils/dbConnect'

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
            <LayoutAdminArea head={<title>Página Inicial</title>} info={info} user={user}>

            </LayoutAdminArea>
        </>
    )


}

export default Index