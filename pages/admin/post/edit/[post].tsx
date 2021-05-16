import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import Post from '../../../../components/forms/post'
import Api from '../../../../services/api'
import { GetStaticProps } from 'next'
import '../../../../components/LoadClasses'
import Navbar from '../../../../components/navbar_admin'
import DbConnect, { Config } from "./../../../../database/connection"


export async function getStaticPaths() {
    return {
        paths: [],
        fallback: true,
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    DbConnect()
    let { info } = { info: null }

    try {
        info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
        info = info._doc.content
    } catch (e) { }

    return {
        props: {
            info,
            link: context.params.post
        },
        revalidate: 1
    }
}

function Blog({ info, link }) {
    const [post, setPost] = useState<any>()
    const [user, setUser] = useState<{ username: string, email: string }>({ username: "", email: "" })

    useEffect(() => {
        if (link)
            Api.get(`/api/post?link=${link}`, { withCredentials: true }).then(response => setPost(response.data?.result))
        Api.get(`/api/auth`, { withCredentials: true }).then(response => { setUser(response.data) })
    }, [link])

    return (
        <>
            <Head>
                <title>Edit post - {post?.title}</title>
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
                    {post?._id ?
                        <Post info={info} category={post?.category?.name} _id={post?._id} description={post?.description} image={post?.image} content={post?.content} link={post?.link} publishDate={post?.publishDate} title={post?.title} />
                        : <div className="flex justify-center items-center h-64">
                            <img src="https://www.wallies.com/filebin/images/loading_apple.gif" alt="loading" className="w-12" />
                        </div>}
                </div>
            </div>
        </>)

}



export default Blog