import React from 'react'
import Cookies from 'cookies'
import LayoutAdmin from './../../layout/layoutAdmin'
import { GetServerSideProps } from 'next'
import HandleAuth from '../../services/auth'
import { Config } from '../../database/models'
import DbConnect from './../../utils/dbConnect'

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
            <LayoutAdmin head={<title>Página Inicial</title>} info={info} user={user}>

            </LayoutAdmin>
        </>
    )


}

export default Index