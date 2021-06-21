import React from 'react'
import { FaHome } from 'react-icons/fa'
import Link from 'next/link';
import { UserI } from '../database/models';

interface MyProps {
    info: any
    user: UserI
}

class Login extends React.Component<MyProps> {
    constructor(props: any) {
        super(props);
        this.state = { ...props }
    }

    render() {

        return (
            <nav
                className={`flex items-center justify-between flex-wrap bg-${this.props?.info?.colors?.background?.color || this.props?.info?.colors?.background?.color} py-4 lg:px-12 shadow-lg border-solid border-t-2 border-${this.props?.info?.colors?.background?.shadow || this.props?.info?.colors?.background?.shadow}`}>
                <div className={`flex justify-between lg:w-auto w-full lg:border-b-0 pl-6 pr-2 border-solid border-b-2 border-${this.props?.info?.colors?.text?.color || this.props?.info?.colors?.text?.color } pb-5 lg:pb-0`}>
                    <div className={`flex items-center flex-shrink-0 text-${this.props?.info?.colors?.text?.color || this.props?.info?.colors?.text?.color } mr-12`}>
                        <Link href='/admin'>
                            <a>
                                <button className="font-semibold text-2xl tracking-tight flex items-center"><FaHome /><i className="ml-2">{this.props?.info?.websiteName || this.props?.info?.websiteName || "Home"}</i></button>
                            </a>
                        </Link>
                    </div>
                    <div className="block lg:hidden">
                        <button
                            id="nav"
                            className={`flex items-center px-3 py-2 border-2 rounded text-${this.props?.info?.colors?.text?.color || this.props?.info?.colors?.text?.color } hover:text-${this.props?.info?.colors?.text?.color || this.props?.info?.colors?.text?.color } border-${this.props?.info?.colors?.text?.color || this.props?.info?.colors?.text?.color || "gray-white"} hover:text-${this.props?.info?.colors?.text?.shadow || this.props?.info?.colors?.text?.color || this.props?.info?.colors?.text?.color} hover:text-${this.props?.info?.colors?.text?.shadow || this.props?.info?.colors?.text?.color || this.props?.info?.colors?.text?.color} hover:border-${this.props?.info?.colors?.text?.shadow || this.props?.info?.colors?.text?.color || this.props?.info?.colors?.text?.color}`}>
                            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title>
                                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="menu w-full flex-grow lg:flex lg:items-center lg:w-auto lg:px-3 px-8">
                    <div className={`text-md font-bold text-${this.props?.info?.colors?.text?.color || this.props?.info?.colors?.text?.color } lg:flex-grow`}>
                        <Link href='/admin/categories'>
                            <a>
                                <button
                                    className={`block mt-4 lg:inline-block lg:mt-0 hover:text-${this.props?.info?.colors?.text?.shadow || this.props?.info?.colors?.text?.color || this.props?.info?.colors?.text?.color} font-semibold px-4 py-2 rounded mr-2`}>
                                    Categorias
                                </button>
                            </a>
                        </Link>
                        <Link href='/admin/post'>
                            <a>
                                <button
                                    className={`block mt-4 lg:inline-block lg:mt-0 hover:text-${this.props?.info?.colors?.text?.shadow || this.props?.info?.colors?.text?.color || this.props?.info?.colors?.text?.color} font-semibold px-4 py-2 rounded mr-2`}>
                                    Postagens
                                </button>
                            </a>
                        </Link>
                        <Link href='/admin/config'>
                            <a>
                                <button
                                    className={`block mt-4 lg:inline-block lg:mt-0 hover:text-${this.props?.info?.colors?.text?.shadow || this.props?.info?.colors?.text?.color || this.props?.info?.colors?.text?.color} font-semibold px-4 py-2 rounded mr-2`}>
                                    Configurações
                                </button>
                            </a>
                        </Link>
                        <Link href='/admin/users'>
                            <a>
                                <button
                                    className={`block mt-4 lg:inline-block lg:mt-0 hover:text-${this.props?.info?.colors?.text?.shadow || this.props?.info?.colors?.text?.color || this.props?.info?.colors?.text?.color} font-semibold px-4 py-2 rounded mr-2`}>
                                    Usuários
                                </button>
                            </a>
                        </Link>
                    </div>
                    <div className="flex">
                        <button
                            className={`block text-md px-4 py-2 rounded text-${this.props?.info?.colors?.text?.color || this.props?.info?.colors?.text?.color } ml-2 hover:text-${this.props?.info?.colors?.text?.color || this.props?.info?.colors?.text?.color} font-bold mt-4 lg:mt-0`}>{this.props?.user?.username || this.props?.user?.username || "Carregando"}</button>
                        <Link href='/admin/logout'>
                            <a>
                                <button className={`block text-md px-4 py-2 rounded text-${this.props?.info?.colors?.text?.color || this.props?.info?.colors?.text?.color } ml-2 hover:text-${this.props?.info?.colors?.text?.color || this.props?.info?.colors?.text?.color} font-bold mt-4 lg:mt-0`}>Sair</button>
                            </a>
                        </Link>
                    </div>
                </div>

            </nav>
        )
    }
}

export default Login