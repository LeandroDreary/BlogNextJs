import React from 'react'
import Head from 'next/head'
import Navbar from './../components/navbar'
import Footer from './../components/footer'
import './../components/LoadClasses'
import { GetServerSideProps } from 'next'
import { Category, Config } from './../database/models'
import DbConnect from './../utils/dbConnect'
import ReactHtmlParser from 'react-html-parser'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    await DbConnect()
    let { info, categories } = { info: null, categories: null }
    
    try {
        info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
        info = info._doc.content
    } catch (e) { }

    try {
        categories = await Category.find({}).exec()
        categories = categories._doc.content
    } catch (e) { }

    return {
        props: {
            info,
            categories: categories?.map(c => { return { color: c?.color, link: c?.link || null, name: c?.name } })
        }

    }
}

const Index = ({ info, categories }) => {

    return (
        <>
            <Head>
                <title>Contato - {info?.websiteName}</title>
                {ReactHtmlParser(info?.customLayoutStyles)}
            </Head>
            <Navbar info={info} categories={categories} />
            <div className="container">

            </div>
            <Footer info={info} />
        </>
    )


}

export default Index