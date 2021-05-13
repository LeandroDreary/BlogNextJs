import { Document } from 'mongoose'
import dbConnect, { User, UserI, Auth, AuthI } from '../database/connection'


const HandleAuth = async (_id) => {
    let user: Document & UserI
    try {
        await dbConnect()
        let auth: Document & AuthI = await Auth.findOne({ _id }).exec()
        if (auth?.user)
            user = await User.findOne(auth?.user).select('-password -_id -__v').exec()

    } catch (e) { }

    return user
}

export default HandleAuth