import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Navbar from '../../components/navbar'
import Card from '../../components/cards/post'
import Sidebar from '../../components/sidebar'
import '../../components/LoadClasses'
import { loadInfo } from '../../services/loadApi'

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: true,
    }
}

export async function getStaticProps(context) {
    let { Info, posts } = { Info: null, posts: null }
    try {
        posts = (await (await fetch(process.env.API_URL + '/api/post/list?select=title%20description%20image%20link&category=' + context.params.category))?.json())?.result
    } catch (e) { }

    try {
        Info = (await (await fetch(process.env.API_URL + '/api/config?name=info')).json())?.result?.content
    } catch (e) { }

    return {
        props: {
            posts: posts || null,
            category: context.params.category,
            Info
        },
        revalidate: 1
    }
}

const Index = ({ posts: posts, category, Info }: { posts: { title: string, description: string, image: string, link: string }[], category: string, Info: any }) => {
    const [info, setInfo] = useState(Info)

    useEffect(() => {
        loadInfo(Info, setInfo)
    }, [Info])
    
    return (
        <div>
            <Head>
                <title>{category || "Not Found"}</title>
            </Head>
            <Navbar info={info} />
            <div className="container mx-auto">
                <div className="grid grid-cols-3">
                    <div className="col-span-3 md:col-span-2">
                        <div className="px-4 mt-4">
                            <h1 className="text-4xl px-2 text-semibold text-gray-700">{category || ""}</h1>
                            <hr className="my-2" />
                        </div>
                        {posts ?
                            posts?.map(post => <Card description={post.description} image={post.image} link={post.link} title={post.title} key={post.link} />) :
                            <div className="flex justify-center items-center h-64">
                                Not Found.
                            </div>
                        }
                    </div>
                    <div className="col-span-3 mx-4 md:col-span-1 md:mx-0">
                        <Sidebar />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index
