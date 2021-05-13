import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Navbar from './../components/navbar'
import Card from '../components/cards/post'
import Sidebar from '../components/sidebar'
import '../components/LoadClasses'
import { loadInfo } from '../services/loadApi'
import ReactHtmlParser from 'react-html-parser'

export async function getStaticProps() {
  let { Info, homePageInfo, posts } = { Info: null, homePageInfo: null, posts: null }
  try {
    posts = (await (await fetch(process.env.API_URL + '/api/post/list?quantity=6&select=title%20description%20image%20link')).json())?.result
  } catch (e) { }

  try {
    Info = (await (await fetch(process.env.API_URL + '/api/config?name=info')).json())?.result?.content
  } catch (e) { }

  try {
    homePageInfo = (await (await fetch(process.env.API_URL + '/api/config?name=homePageInfo')).json())?.result?.content
  } catch (e) { }


  return {
    props: {
      posts,
      Info,
      homePageInfo
    },
    revalidate: 1
  }
}

const Index = ({ posts, homePageInfo, Info }: { posts: { title: string, description: string, image: string, link: string }[], homePageInfo: any, Info: any }) => {
  const [info, setInfo] = useState(Info)
  useEffect(() => {
    loadInfo(Info, setInfo)
  }, [Info])
  return (
    <>
      <div>
        <Head>
          <title>{homePageInfo?.title} - {info?.websiteName}</title>
          <link href="/icon.png" rel="icon" />
          <link rel="canonical" href={process.env.API_URL} />
          <meta name="description" content={homePageInfo?.description} />
          <meta name="keywords" content={info?.keywords} />

          <meta property="og:description" content={homePageInfo?.description} />
          <meta property="og:url" content={process.env.API_URL} />
          <meta property="og:type" content={"website"} />
          <meta property="og:site_name" content={info?.websiteName} />
          <meta property="og:image" content={homePageInfo?.banner} />
          <meta property="og:image:secure_url" content={homePageInfo?.banner} />
          <meta property="og:title" content={`${homePageInfo?.title} - ${info?.websiteName}`} />
          <meta property="og:locale" content={info?.locale} />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:description" content={homePageInfo?.description.toString()} />
          <meta name="twitter:image" content={homePageInfo?.banner?.toString()} />
          <meta name="twitter:title" content={`${homePageInfo?.title} - ${info?.websiteName}`} />
          <meta name="twitter:site" content="@" />
          <meta name="twitter:creator" content="@" />

          {ReactHtmlParser(homePageInfo?.head)}
        </Head>

        <Navbar info={info} />
        <div className="col-span-3 mb-4 md:mb-0 w-full mx-auto bg-cover bg-center relative"
          style={{ backgroundImage: `url(${homePageInfo?.banner})` }}>
          <div className={`left-0 bottom-0 w-full h-full absolute z-10 flex items-center opacity-70 bg-gradient-to-t from-${info?.colors?.background?.color || "gray-500"} to-${"black"}`}
            style={{ minHeight: "30em" }}>
            <div className="h-full w-full bg-black opacity-70">
            </div>
          </div>
          <div className={`left-0 bottom-0 w-full h-full z-20 flex items-center`}
            style={{ minHeight: "30em" }}>

            <div className="p-4 h-full grid grid-cols-2 z-20 items-center container mx-auto">
              <div className="md:hidden col-span-2 md:col-span-1 pt-4">
                <span className={`text-sm bg-${info?.colors?.background?.color || "gray-500"} text-${info?.colors?.text?.color || "white"} font-extrabold px-4 py-2`}>Featured</span>
                <div className={`bg-white ring-4 ring-${info?.colors?.text?.shadow || "gray-700"} ring-opacity-70 rounded-lg flex items-center justify-center mt-6 p-2`}>
                  <img src={posts ? posts[0]?.image : ""} className=" max-w-full" alt={posts ? posts[0]?.title : ""} />
                </div>
              </div>
              <div className="col-span-2 md:col-span-1 px-2 py-4">
                <span className={`text-sm bg-${info?.colors?.background?.color || "gray-500"} text-${info?.colors?.text?.color || "white"} font-extrabold px-4 py-2 hidden md:inline-block`}>Featured</span>
                <h1 className="text-2xl font-bold text-white mt-4 mb-2">
                  {posts ? posts[0]?.title : ""}
                </h1>
                <p className="text-lg text-gray-100">{posts ? posts[0]?.description?.substr(0, 200) + (posts[0]?.description?.length > 100 ? "..." : "") : ""}</p>
                <Link href={"/post/" + (posts ? posts[0]?.link : "")}>
                  <a>
                    <button className={`bg-${info?.colors?.background?.color || "gray-500"} text-${info?.colors?.text?.color || "white"} font-extrabold px-4 py-2 my-4`}>Finish Read</button>
                  </a>
                </Link>
              </div>
              <div className="hidden md:block col-span-2 md:col-span-1">
                <div className={`bg-white ring-4 ring-${info?.colors?.text?.shadow || "gray-700"} ring-opacity-70 flex items-center justify-center rounded-lg p-4`}>
                  <img src={posts ? posts[0]?.image : ""} className={`rounded max-w-full`} alt={posts ? posts[0]?.title : ""} />
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className="container mx-auto">
          <div className="grid grid-cols-3">
            <div className="col-span-3 md:col-span-2">
              <div className="px-4 mt-4">
                <p className="text-4xl px-2 text-semibold text-gray-700">Home Page</p>
                <hr className="my-2" />
              </div>
              {posts ?
                posts?.filter((v, i) => i !== 0)?.map(post => <Card description={post.description} image={post.image} link={post.link} title={post.title} key={post.link} />)
                :
                <div className="flex justify-center items-center h-64">
                  not Found.
              </div>
              }
            </div>
            <div className="col-span-3 mx-4 md:col-span-1 md:mx-0">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Index
