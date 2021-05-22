import React from 'react'
import { FaHome } from 'react-icons/fa'
import Link from 'next/link';
import { UserI } from '../../database/connection';

interface MyProps {
    info: any
    user: UserI
}

interface MyState {
    info: any,
    user: UserI
}

class Login extends React.Component<MyProps, MyState> {
    constructor(props: any) {
        super(props);
        this.state = { ...props }
    }

    componentDidMount() {
        if (this.props?.user) {
            if (this.state?.user !== this.props?.user) {
                localStorage.setItem("user_admin_area", JSON.stringify(this.props?.user))
                this.setState({ ...this.state, user: this.props?.user })
            }
        } else {
            if (localStorage.getItem("user_admin_area")) {
                if (JSON.parse(localStorage.getItem("user_admin_area")) !== this.state.user)
                    this.setState({ ...this.state, user: JSON.parse(localStorage.getItem("user_admin_area")) })
            }
        }
        if (this.props?.info) {
            if (this.state.info !== this.props.info) {
                localStorage.setItem("info", JSON.stringify(this.props.info))
                this.setState({ ...this.state, info: this.props?.info })
            }
        } else {
            if (localStorage.getItem("info")) {
                if (JSON.parse(localStorage.getItem("info")) !== this.state.user)
                    this.setState({ ...this.state, info: JSON.parse(localStorage.getItem("info")) })
            }
        }
    }

    render() {

        return (
            <nav
                className={`flex items-center justify-between flex-wrap bg-${this.props?.info?.colors?.background?.color || this.state?.info?.colors?.background?.color || "gray-500"} py-4 lg:px-12 shadow-lg border-solid border-t-2 border-${this.props?.info?.colors?.background?.shadow || this.state?.info?.colors?.background?.shadow || "gray-700"}`}>
                <div className={`flex justify-between lg:w-auto w-full lg:border-b-0 pl-6 pr-2 border-solid border-b-2 border-${this.props?.info?.colors?.text?.color || this.state?.info?.colors?.text?.color || "white"} pb-5 lg:pb-0`}>
                    <div className={`flex items-center flex-shrink-0 text-${this.props?.info?.colors?.text?.color || this.state?.info?.colors?.text?.color || "white"} mr-12`}>
                        <Link href='/AdminArea'>
                            <a>
                                <button className="font-semibold text-2xl tracking-tight flex items-center"><FaHome /><i className="ml-2">{this.props?.info?.websiteName || this.state?.info?.websiteName || "Home"}</i></button>
                            </a>
                        </Link>
                    </div>
                    <div className="block lg:hidden">
                        <button
                            id="nav"
                            className={`flex items-center px-3 py-2 border-2 rounded text-${this.props?.info?.colors?.text?.color || this.state?.info?.colors?.text?.color || "white"} hover:text-${this.props?.info?.colors?.text?.color || this.state?.info?.colors?.text?.color || "white"} border-${this.props?.info?.colors?.text?.color || this.state?.info?.colors?.text?.color || "gray-white"} hover:text-${this.props?.info?.colors?.text?.shadow || this.props?.info?.colors?.text?.color || this.state?.info?.colors?.text?.color || "gray-100"} hover:text-${this.props?.info?.colors?.text?.shadow || this.props?.info?.colors?.text?.color || this.state?.info?.colors?.text?.color || "gray-100"} hover:border-${this.props?.info?.colors?.text?.shadow || this.props?.info?.colors?.text?.color || this.state?.info?.colors?.text?.color || "gray-100"}`}>
                            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title>
                                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="menu w-full flex-grow lg:flex lg:items-center lg:w-auto lg:px-3 px-8">
                    <div className={`text-md font-bold text-${this.props?.info?.colors?.text?.color || this.state?.info?.colors?.text?.color || "white"} lg:flex-grow`}>
                        <Link href='/AdminArea/categories'>
                            <a>
                                <button
                                    className={`block mt-4 lg:inline-block lg:mt-0 hover:text-${this.props?.info?.colors?.text?.shadow || this.props?.info?.colors?.text?.color || this.state?.info?.colors?.text?.color || "gray-100"} font-semibold px-4 py-2 rounded mr-2`}>
                                    Categorias
                                </button>
                            </a>
                        </Link>
                        <Link href='/AdminArea/config'>
                            <a>
                                <button
                                    className={`block mt-4 lg:inline-block lg:mt-0 hover:text-${this.props?.info?.colors?.text?.shadow || this.props?.info?.colors?.text?.color || this.state?.info?.colors?.text?.color || "gray-100"} font-semibold px-4 py-2 rounded mr-2`}>
                                    Configurações
                                </button>
                            </a>
                        </Link>
                        <Link href='/AdminArea/users'>
                            <a>
                                <button
                                    className={`block mt-4 lg:inline-block lg:mt-0 hover:text-${this.props?.info?.colors?.text?.shadow || this.props?.info?.colors?.text?.color || this.state?.info?.colors?.text?.color || "gray-100"} font-semibold px-4 py-2 rounded mr-2`}>
                                    Usuários
                                </button>
                            </a>
                        </Link>
                    </div>
                    <div className="flex">
                        <button
                            className={`block text-md px-4 py-2 rounded text-${this.props?.info?.colors?.text?.color || this.state?.info?.colors?.text?.color || "white"} ml-2 hover:text-${this.props?.info?.colors?.text?.color || this.state?.info?.colors?.text?.color || "gray-100"} font-bold mt-4 lg:mt-0`}>{this.props?.user?.username || this.state?.user?.username || "Carregando"}</button>
                        <button className={`block text-md px-4 py-2 rounded text-${this.props?.info?.colors?.text?.color || this.state?.info?.colors?.text?.color || "white"} ml-2 hover:text-${this.props?.info?.colors?.text?.color || this.state?.info?.colors?.text?.color || "gray-100"} font-bold mt-4 lg:mt-0`}>Sair</button>
                    </div>
                </div>

            </nav>
        )
    }
}

export default Login