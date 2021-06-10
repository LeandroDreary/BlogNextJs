import React from 'react'
import { Footer, Navbar } from './../components'
import Head from 'next/head'
import ReactHtmlParser from 'react-html-parser'

interface props {
    head?: any;
    navbar?: any;
    footer?: any;
    info?: any;
    categories?: any;
}

let Index: React.FC<props> = ({ footer, head, navbar, categories, info, children }) => {
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
                {ReactHtmlParser(info?.customLayoutStyles)}
                {head}
            </Head>
            {navbar ?
                navbar :
                <Navbar categories={categories} info={info} />
            }
            {children}
            {footer ?
                footer :
                <Footer info={info} />
            }
        </>
    )
}

export default Index