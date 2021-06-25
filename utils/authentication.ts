import Cookies from 'cookies'
import { IncomingMessage, ServerResponse } from 'http'
import { NextApiRequestCookies } from 'next/dist/next-server/server/api-utils'
import mongoose, { Document } from 'mongoose'
import bcrypt from 'bcryptjs'
import dbConnect from './dbConnect'
import { Auth, AuthI, User, UserI } from '../database/models'
import { GetServerSidePropsResult, NextApiRequest, NextApiResponse } from 'next'

type Context = {
    req: IncomingMessage & {
        cookies: NextApiRequestCookies;
    },
    res: ServerResponse
}
type ContextApi = {
    req: NextApiRequest,
    res: NextApiResponse
}

export const findUserByAuth = async (id: string) => {
    let userGet: Document & UserI
    try {
        let auth: Document<any, any> & AuthI = await Auth.findOne(mongoose.Types.ObjectId(id)).exec()
        if (auth?.user)
            userGet = await User.findOne({ _id: auth?.user }).select('-password _id -__v').exec()
    } catch (e) { }
    return userGet
}

export const AuthorAuthApi = async (context: ContextApi, callBack: ({ user }: { user: UserI }) => any) => {
    await dbConnect()
    const cookies = new Cookies(context.req, context.res)

    let userGet = await findUserByAuth(cookies.get('authorAuth'))

    return callBack({ user: userGet ? userGet.toJSON() : null })
}

export const AuthorAuth = async (context: Context, callBack: ({ user }: { user: UserI }) => Promise<GetServerSidePropsResult<any>>) => {
    await dbConnect()
    const cookies = new Cookies(context.req, context.res)

    let userGet = await findUserByAuth(cookies.get('authorAuth'))

    if (userGet) {
        return callBack({ user: userGet.toJSON() })
    } else {
        return {
            redirect: {
                destination: '/author/signin',
                permanent: false,
            }
        }
    }
}

export const AdminAuthApi = (context: Context, callBack: ({ user: { username } }: { user: { username: string } }) => any) => {
    const cookies = new Cookies(context.req, context.res)

    if (bcrypt.compareSync(`${process.env.ADMINPASSWORD}_${process.env.ADMINUSERNAME}`, cookies.get('adminAuth') || "")) {
        return callBack({ user: { username: process.env.ADMINUSERNAME } })
    } else {
        return callBack({ user: null })
    }
}

export const AdminAuth = (context: Context, callBack: ({ user: { username } }: { user: { username: string } }) => Promise<GetServerSidePropsResult<any>>) => {
    const cookies = new Cookies(context.req, context.res)

    if (bcrypt.compareSync(`${process.env.ADMINPASSWORD}_${process.env.ADMINUSERNAME}`, cookies.get('adminAuth') || "")) {
        return callBack({ user: { username: process.env.ADMINUSERNAME } })
    } else {
        return {
            redirect: {
                destination: '/admin/signin',
                permanent: false,
            }
        }
    }
}
