import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Navbar from './../components/navbar'
import Card from '../components/cards/post'
import Sidebar from '../components/sidebar'
import '../components/LoadClasses'
import ReactHtmlParser from 'react-html-parser'
import DbConnect, { Config, Post, PostI } from "./../database/connection"
import { ListCategories } from './api/category/list'


export async function getStaticProps() {
  await DbConnect()

  let { info, homePageInfo, posts, categories } = { info: null, homePageInfo: null, posts: null, categories: null }
  try {
    let perPage = 6
    posts = (await Post.find({ publishDate: { $lte: new Date() } }, ["image", "link", "title", "description", "-_id"], { skip: 0, limit: perPage, sort: { publishDate: -1 } }).exec())
      .map((post: any) => { return { image: String(post?.image || ""), link: String(post?.link || ""), title: String(post?.title || ""), description: String(post?.description || "") } })
  } catch (e) { }

  try {
    info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
    info = info._doc.content
  } catch (e) { }

  try {
    homePageInfo = await Config.findOne({ name: "homePageInfo" }).select(`-_id`).exec()
    homePageInfo = homePageInfo._doc.content
  } catch (e) { }

  try {
    categories = (await ListCategories({})).result
  } catch (e) { }

  return {
    props: {
      posts,
      homePageInfo,
      info,
      categories
    },
    revalidate: 1
  }
}

const Index = ({ posts, homePageInfo, info, categories }) => {
  console.log(info)
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
          {ReactHtmlParser(info?.customLayoutStyles)}
        </Head>

        <Navbar categories={categories} info={info} />
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
                <span className={`text-sm bg-${info?.colors?.background?.color || "gray-500"} text-${info?.colors?.text?.color || "white"} font-extrabold px-4 py-2`}>Destaque</span>
                <div className={`border-4 border-${info?.colors?.background?.color || "gray-500"} rounded-lg flex items-center justify-center mt-6 p-2`}>
                  <img src={posts ? posts[0]?.image : ""} className="w-full" alt={posts ? posts[0]?.title : ""} />
                </div>
              </div>
              <div className="col-span-2 md:col-span-1 px-2 py-4">
                <span className={`text-sm bg-${info?.colors?.background?.color || "gray-500"} text-${info?.colors?.text?.color || "white"} font-extrabold px-4 py-2 hidden md:inline-block`}>Destaque</span>
                <h1 className="text-2xl font-bold text-white mt-4 mb-2">
                  {posts ? posts[0]?.title : ""}
                </h1>
                <p className="text-lg text-gray-100">{posts ? posts[0]?.description?.substr(0, 200) + (posts[0]?.description?.length > 100 ? "..." : "") : ""}</p>
                <Link href={"/post/" + (posts ? posts[0]?.link : "")}>
                  <a>
                    <button className={`bg-${info?.colors?.background?.color || "gray-500"} text-${info?.colors?.text?.color || "white"} font-extrabold px-4 py-2 my-4`}>Continuar lendo...</button>
                  </a>
                </Link>
              </div>
              <div className="hidden md:block col-span-2 md:col-span-1">
                <div className={`border-4 border-${info?.colors?.background?.color || "gray-500"} flex items-center justify-center rounded-lg p-1`}>
                  <img src={posts ? posts[0]?.image : ""} className={`rounded w-full`} alt={posts ? posts[0]?.title : ""} />
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className="container mx-auto">
          <div className="grid grid-cols-3">
            <div className="col-span-3 md:col-span-2">
              <div className="px-4 mt-4">
                <p className="text-4xl px-2 text-semibold text-gray-700">Recentes:</p>
                <hr className="my-2" />
              </div>
              {posts ?
                posts?.filter((v, i) => i !== 0)?.map(post => <Card info={info} description={post.description} image={post.image} link={post.link} title={post.title} key={post.link} />)
                :
                <div className="flex justify-center items-center h-64">
                  not Found.
              </div>
              }
            </div>
            <div className="col-span-3 mx-4 md:col-span-1 md:mx-0">
              <Sidebar categories={categories} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Index
