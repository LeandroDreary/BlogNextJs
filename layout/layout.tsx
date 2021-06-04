import React from 'react'
import ENavbar from './../components/navbar'
import EFooter from './../components/footer'
import EHead from 'next/head'
import ReactHtmlParser from 'react-html-parser'

interface props {
    Head?: any;
    Navbar?: any;
    Footer?: any;
    info?: any;
    categories?: any;
}

let Index: React.FC<props> = ({ Footer, Head, Navbar, categories, info, children }) => {
    return (
        <>
            <EHead>
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
                {ReactHtmlParser(info?.customLayoutStyles)}
                {Head}
            </EHead>
            {Navbar ?
                Navbar :
                <ENavbar categories={categories} info={info} />
            }
            {children}
            {Footer ?
                Footer :
                <EFooter info={info} />
            }
        </>
    )
}

export default Index