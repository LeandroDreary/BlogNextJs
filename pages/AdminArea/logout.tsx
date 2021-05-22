import React from 'react'
import Cookies from 'cookies'
import '../../components/LoadClasses'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const cookies = new Cookies(req, res)
    cookies.set('AdminAreaAuth')

    return {
        redirect: {
            destination: '/AdminArea/signin',
            permanent: false,
        }
    }
}

const Index = () => {

    return (
        <>
        </>
    )


}

export default Index