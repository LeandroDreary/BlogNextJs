import React, { useState } from 'react'
import LayoutAdminArea from './../../../../layout/layoutAdminArea'
import Api from '../../../../services/api'
import { GetServerSideProps } from 'next'
import { Config, ConfigI, User, UserI } from "../../../../database/models"
import DbConnect from './../../../../utils/dbConnect'
import Link from 'next/link'
import Router from 'next/router'
import { Document } from 'mongoose'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    await DbConnect()

    let info: ConfigI & Document<any, any> = null
    try {
        info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
    } catch (e) { }

    let user: ConfigI & Document<any, any> = null
    try {
        user = await User.findOne({ username: String(params.username) }).exec();
    } catch (e) { }


    return {
        props: {
            info: info?.toJSON()?.content,
            user: {
                ...user?.toJSON(),
                _id: String(user?.toJSON()?._id || "")
            }
        }
    }
}

function Blog({ info, user }) {
    const [userF, setUserF] = useState<UserI>(user)
    const [password, setPassword] = useState<string>()
    const [warnings, setWarnings] = useState<{ message: string, input: string }[]>([])

    const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setWarnings([])
        await Api.put(`/api/user`, userF, { withCredentials: true }).then(response => {
            setWarnings(response.data?.warnings || [])
        })
        if (warnings.length <= 0)
            Router.push("/AdminArea/users")
    }


    return (
        <>
            <LayoutAdminArea head={<title>Editar usuário - {user?.username || "usuário não encontrado"}</title>} info={info} user={user}>
                <div className="container mx-auto">
                    <div>
                        <Link href="/AdminArea/users">
                            <a>
                                <button className={`mr-5 bg-${info?.colors?.background?.color} hover:bg-${info?.colors?.background?.shadow} text-${info?.colors?.text?.shadow} hover:text-${info?.colors?.text?.color} m-4 font-bold py-2 px-6 rounded-lg`}>
                                    Voltar
                                </button>
                            </a>
                        </Link>
                    </div>
                    <hr />
                    <div>
                        {userF?._id ?
                            <>
                                <form onSubmit={HandleSubmit} method="put">
                                    <div className="w-full grid grid-cols-6 gap-4">
                                        <div className="col-span-1">
                                        </div>
                                        <div className="col-span-4">
                                            <div className="my-4">
                                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Usuário</span>
                                                </div>
                                                <div className="p-4 border shadow-md">
                                                    <input onChange={e => setUserF({ ...userF, username: e.target.value })} defaultValue={userF?.username} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="username" id="username" type="text" placeholder="Username" />
                                                    {
                                                        warnings.map(warning => {
                                                            if (warning.input === "username")
                                                                return <p className="text-red-400 text-xs italic font-bold my-1">{warning.message}</p>
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full grid grid-cols-6 gap-4">
                                        <div className="col-span-1">
                                        </div>
                                        <div className="col-span-4">
                                            <div className="my-4">
                                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Discord</span>
                                                </div>
                                                <div className="p-4 border shadow-md">
                                                    <input onChange={e => setUserF({ ...userF, discordUser: e.target.value })} defaultValue={userF?.discordUser} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="discordUser" id="discordUser" type="text" placeholder="Discord" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full grid grid-cols-6 gap-4">
                                        <div className="col-span-1">
                                        </div>
                                        <div className="col-span-4">
                                            <div className="my-4">
                                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Ativo</span>
                                                </div>
                                                <div className="p-4 border shadow-md">
                                                    <input type="checkbox" onChange={e => setUserF({ ...userF, activated: e.target.checked })} checked={userF?.activated} className="shadow border border-red rounded py-2 px-3 text-grey-400 mb-3" name="activated" id="activated" placeholder="activated" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full grid grid-cols-6 gap-4">
                                        <div className="col-span-1">
                                        </div>
                                        <div className="col-span-4">
                                            <div className="my-4">
                                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Senha</span>
                                                </div>
                                                <div className="p-4 border shadow-md">
                                                    <button type="button" onClick={() => { let p = Math.random().toString(36).slice(-8); setUserF({ ...userF, password: p }); setPassword(p) }} className={`mr-5 mb-4 bg-${info?.colors.background?.color} hover:bg-${info?.colors.background?.shadow} text-${info?.colors.text?.shadow} hover:text-${info?.colors.text?.color} font-bold py-2 px-6 rounded-lg`}>
                                                        Gerar Senha
                                                    </button>
                                                    <input onChange={e => { setPassword(e.target.value); setUserF({ ...userF, password: e.target.value }) }} value={password} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="password" id="password" type="text" placeholder="Password" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className={`mr-5 my-4 bg-${info?.colors.background?.color} hover:bg-${info?.colors.background?.shadow} text-${info?.colors.text?.shadow} hover:text-${info?.colors.text?.color} font-bold py-2 px-6 rounded-lg`}>
                                            Salvar
                                        </button>
                                    </div>
                                </form>
                            </>
                            : <div className="flex justify-center items-center h-64">
                                <h2>Usuário não encontrado.</h2>
                            </div>}
                    </div>
                </div>
            </LayoutAdminArea>
        </>)

}



export default Blog