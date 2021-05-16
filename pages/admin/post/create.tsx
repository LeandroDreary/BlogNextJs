import React from 'react'
import Head from 'next/head'
import Cookies from 'cookies'
import Router from 'next/router'
import Navbar from '../../../components/navbar_admin'
import Post from './../../../components/forms/post'
import { GetServerSideProps } from 'next'
import '../../../components/LoadClasses'
import HandleAuth from '../../../services/auth'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const cookies = new Cookies(req, res)
    let { info, user } = { info: null, user: null }
    try {
        info = (await (await fetch(process.env.API_URL + '/api/config?name=info')).json())?.result?.content
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
            <Head>
                <title>Create post</title>

                <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.js"></script>
                <link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.css" rel="stylesheet" />
            </Head>

            <Navbar info={info} user={user} />
            <div className="container mx-auto">
                <div>
                    <button onClick={() => Router.push('/admin/post')} className={`mr-5 bg-${info?.colors?.background?.color} hover:bg-${info?.colors?.background?.shadow} text-${info?.colors?.text?.shadow} hover:text-${info?.colors?.text?.color} m-4 font-bold py-2 px-6 rounded-lg`}>
                        Back
                    </button>
                </div>
                <hr />
                <div>
                    {process.browser ?
                        <Post info={info} /> : ""
                    }
                </div>
            </div>
        </>
    )
}

export default Index