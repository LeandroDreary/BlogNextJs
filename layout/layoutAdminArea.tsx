import React from 'react'
import { Footer,  NavbarAdminArea } from './../components'
import Head from 'next/head'
import ReactHtmlParser from 'react-html-parser'

interface props {
    head?: any;
    navbar?: any;
    footer?: any;
    info?: any;
    user?: any;
}

let Index: React.FC<props> = ({ footer, head, navbar, user, info, children }) => {
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
                {ReactHtmlParser(info?.customLayoutStyles)}
                {head}
            </Head>
            {navbar ?
                navbar :
                <NavbarAdminArea user={user} info={info} />
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