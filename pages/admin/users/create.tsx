import React, { useState } from 'react'
import { GetServerSideProps } from 'next'
import getRawBody from 'raw-body'
import bcrypt from 'bcryptjs'
import Link from 'next/link'
import LayoutAdminArea from '../../../layout/layoutAdmin'
import { User } from '../../../database/models'
import DbConnect from './../../../utils/dbConnect'
import { AdminAuth } from '../../../utils/authentication'
import { getPageInfo } from '../../../services/getPageInfo'
import { cache } from '../../../services/cache'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    return AdminAuth({ req, res }, async ({ user }) => {
        await DbConnect()

        let warnings = []

        const url = new URL(`${process.env.API_URL}/?` + (await getRawBody(req)).toString("utf-8"));
        const { username, discordUser, password } = { username: url.searchParams.get("username"), discordUser: url.searchParams.get("discordUser"), password: url.searchParams.get("password") }

        const info = cache({ name: "info" }, await getPageInfo());

        if (req.method === "POST")
            if ((await User.find({ username }).collation({ locale: "en", strength: 2 }).exec()).length > 0)
                warnings.push({ message: "Usuário já existe.", input: "username" })

        if (warnings.length <= 0)
            switch (req.method) {
                case "POST":
                    await (new User({ username, activated: true, discordUser, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) })).save()
                    return {
                        redirect: {
                            destination: '/admin/users',
                            permanent: false,
                        }
                    }
            }
        return {
            props: {
                info,
                user,
                warnings,
                inputs: { username, discordUser }
            }
        }
    })
}

const Index = ({ info, user, warnings, inputs }) => {

    const [password, setPassword] = useState<string>(Math.random().toString(36).slice(-8))

    return (
        <>
            <LayoutAdminArea head={<title>Novo usuário - {info?.websiteName || ""}</title>} info={info} user={user}>
                <div className="container mx-auto">
                    <Link href="/admin/users">
                        <a>
                            <button className={`mr-5 my-4 bg-${info?.colors.background?.color} hover:bg-${info?.colors.background?.shadow} text-${info?.colors.text?.shadow} hover:text-${info?.colors.text?.color} font-bold py-2 px-6 rounded-lg`}>
                                Voltar
                            </button>
                        </a>
                    </Link>
                    <hr />
                    <form method="post">
                        <div className="w-full grid grid-cols-6 gap-4">
                            <div className="col-span-1">
                            </div>
                            <div className="col-span-4">
                                <div className="my-4">
                                    <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                        <span className={`font-semibold text-${info?.colors?.text?.color}`}>Usuário</span>
                                    </div>
                                    <div className="p-4 border shadow-md">
                                        <input defaultValue={inputs?.username} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="username" id="username" type="text" placeholder="Username" />
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
                                        <input defaultValue={inputs?.discordUser} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="discordUser" id="discordUser" type="text" placeholder="Discord" />
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
                                        <button type="button" onClick={() => setPassword(Math.random().toString(36).slice(-8))} className={`mr-5 mb-4 bg-${info?.colors.background?.color} hover:bg-${info?.colors.background?.shadow} text-${info?.colors.text?.shadow} hover:text-${info?.colors.text?.color} font-bold py-2 px-6 rounded-lg`}>
                                            Gerar nova senha
                                        </button>
                                        <input value={password} onChange={e => setPassword(e.target.value)} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="password" id="password" type="text" placeholder="Password" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <button type="submit" className={`mr-5 my-4 bg-${info?.colors.background?.color} hover:bg-${info?.colors.background?.shadow} text-${info?.colors.text?.shadow} hover:text-${info?.colors.text?.color} font-bold py-2 px-6 rounded-lg`}>
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </LayoutAdminArea>
        </>
    )


}

export default Index