import React from 'react'
import Layout from './../layout/layout'
import { PostCard2 } from '../components'
import ReactHtmlParser from 'react-html-parser'
import { Config, Category, CategoryI } from "../database/models"
import DbConnect from './../utils/dbConnect'
import { GetStaticProps } from 'next'
import { listPosts } from './api/post/list'
import { HomePageInfoI, PostCardI, PagesInfoI } from '../utils/types'

interface PageProps {
  posts: PostCardI[],
  homePageInfo: HomePageInfoI,
  info: PagesInfoI,
  categories: CategoryI[],
  postsCategories: {
    category: CategoryI,
    posts: PostCardI[]
  }
}

export let getStaticProps: GetStaticProps = async ({ }) => {
  await DbConnect()

  let posts = null
  try {
    let perPage = 6
    posts = (await listPosts({ select: "image link title description -_id", perPage, beforeDate: new Date() })).result
  } catch (e) { }

  let info = null
  try {
    info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
    info = info._doc.content
  } catch (e) { }

  let homePageInfo = null
  try {
    homePageInfo = await Config.findOne({ name: "homePageInfo" }).select(`-_id`).exec()
    homePageInfo = homePageInfo._doc.content
  } catch (e) { }

  let categories = null
  try {
    categories = await Category.find({}).exec()
    categories = categories._doc.content
  } catch (e) { }

  let postsCategories = []
  try {
    let i = 0
    while (i <= 2) {
      if (categories[i]?._id) {
        let postsCategory = (await listPosts({ category: categories[i]._id, select: "image link title description -_id", perPage: 4, beforeDate: new Date() })).result

        postsCategories.push({ category: { color: categories[i]?.color, link: categories[i]?.link || null, name: categories[i]?.name }, posts: postsCategory })
      }
      i++
    }
  } catch (e) { console.error(e) }

  return {
    props: {
      posts,
      homePageInfo,
      info,
      categories: categories?.map(c => { return { color: c?.color, link: c?.link || null, name: c?.name } }),
      postsCategories
    },
    revalidate: 1
  }
}

const Index = ({ posts, homePageInfo, info, categories, postsCategories }) => {

  let ReturnHead = <>
    <title>{homePageInfo?.title} - {info?.websiteName}</title>

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
    <style>
      {`
            @keyframes slideInFromLeft {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(0);
              }
            }
            .banner-image { 
              animation: 1s ease-out 0s 1 slideInFromLeft;
            }
            
            `}
    </style>
    {ReactHtmlParser(homePageInfo?.head)}
  </>

  return (
    <>
      <Layout head={ReturnHead} info={info} categories={categories}>

        <div className="" style={{background: "linear-gradient(90deg, rgba(9,137,249,1) 0%, rgba(38,235,228,1) 100%)"}}>
          <div className="container min-h-screen mx-auto">
            <div className="absolute max-w-2xl min-h-screen">
              <div className="pt-16">
                <h1 className="text-gray-50 font-semibold text-5xl">Hospede seu blog customizável gratuitamente.</h1>
                <p className="py-12 text-xl text-gray-100">Utilizando serviços da netlify ou vercel você pode hospedar seu BlogNextJS gratuitamente.</p>
              </div>
            </div>
            <div className="float-right px-10 pt-16">
              <img src="/img/blogging.svg" className="h-96" alt="blogging" />
            </div>
          </div>
        </div>


        <div className="bg-white border border-gray-100">
          <div className="container mx-auto">
            {
              postsCategories?.map(postsCategory => {
                return (
                  <>
                    <div key={"postsCategory_" + postsCategory.category.name} className="px-4 py-6 mt-4">
                      <h2 className={`pl-8 text-2xl px-2 text-semibold text-white py-2 pb-3`} style={{ backgroundColor: postsCategory.category.color }}>{postsCategory.category.name}:</h2>
                      {/* <hr className="my-2" /> */}
                      <div className="grid grid-cols-4">
                        {postsCategory.posts ?
                          postsCategory.posts.map(post => <PostCard2 info={info} description={post.description} image={post.image} link={post.link} title={post.title} key={post.link} />)
                          :
                          <div className="flex justify-center items-center h-64">
                            Não encontrado.
                          </div>
                        }
                      </div>
                    </div>
                  </>
                )
              })
            }
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Index
