import React from 'react'
import Cookies from 'cookies'
import Router from 'next/router'
import LayoutAdmin from './../../../layout/layoutAdmin'
import Post from '../../../components/forms/frm_post'
import { GetServerSideProps } from 'next'
import HandleAuth from '../../../services/auth'
import { Config } from '../../../database/models'
import DbConnect from './../../../utils/dbConnect'

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

const Index = ({ info, user }) => {
    return (
        <>
            <LayoutAdmin head={<title>Novo Post</title>} info={info} user={user}>
                <div className="container mx-auto">
                    <div>
                        <button onClick={() => Router.push('/admin/post')} className={`mr-5 bg-${info?.colors?.background?.color} hover:bg-${info?.colors?.background?.shadow} text-${info?.colors?.text?.shadow} hover:text-${info?.colors?.text?.color} m-4 font-bold py-2 px-6 rounded-lg`}>
                            Voltar
                    </button>
                    </div>
                    <hr />
                    <div>
                        {process.browser ?
                            <Post info={info} /> : ""
                        }
                    </div>
                </div>
            </LayoutAdmin>
        </>
    )
}

export default Index