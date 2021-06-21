import React from 'react'
import { GetServerSideProps } from 'next'
import LayoutAdmin from '../../layout/layoutAuthor'
import { Config } from '../../database/models'
import DbConnect from './../../utils/dbConnect'
import { AuthorAuth } from '../../utils/authentication'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    return AuthorAuth({ req, res }, async ({ user }) => {
        await DbConnect()

        let info = null
        try {
            info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
            info = info._doc.content
        } catch (e) { }

        return {
            props: {
                info,
                user: {
                    username: user?.username || null
                }
            }
        }
    })
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