import { Document } from 'mongoose'
import { User, UserI, Auth, AuthI } from '../database/models'
import dbConnect from './../utils/dbConnect'

const HandleAuth = async (_id) => {
    let user: Document & UserI
    try {
        await dbConnect()
        let auth: Document & AuthI = await Auth.findOne({ _id }).exec()
        if (auth?.user)
            user = await User.findOne({ _id: auth?.user }).select('-password _id -__v').exec()

    } catch (e) { }

    return user
}

export default HandleAuth