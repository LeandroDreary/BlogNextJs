import React from 'react'
import Link from 'next/link'
import { FaHome, FaSearch } from 'react-icons/fa'
import Router from 'next/router'

interface MyProps {
    info: any,
    categories: {
        name: string,
        color: string
    }[]
}

interface MyState {
    info: any,
    search: string,
    categories: {
        name: string,
        color: string
    }[]
}

class Login extends React.Component<MyProps, MyState> {
    constructor(props: any) {
        super(props);
        this.state = { ...props, search: "", categories: [{ name: "", color: "" }] }
    }

    componentDidUpdate() {
        if (this.state.info !== this.props.info)
            this.setState({ ...this.props, search: "" })
    }

    render() {
        return (
            <nav
                className={`flex items-center justify-between flex-wrap bg-${this.state?.info?.colors?.background?.color || "gray-500"} py-4 lg:px-12 shadow-lg border-solid border-t-2 border-${this.state?.info?.colors?.background?.shadow || "gray-700"}`}>
                <div className={`flex justify-between lg:w-auto w-full lg:border-b-0 pl-6 pr-2 border-solid border-b-2 border-${this.state?.info?.colors?.text?.color || "white"} pb-5 lg:pb-0`}>
                    <div className={`flex items-center flex-shrink-0 text-${this.state?.info?.colors?.text?.color || "white"} mr-12`}>
                        <Link href="/">
                            <a>
                                <button className="font-semibold text-2xl tracking-tight flex items-center"><FaHome /><i className="ml-2">{this.state?.info?.websiteName || "Home"}</i></button>
                            </a>
                        </Link>
                    </div>
                    <div className="block lg:hidden">
                        <button
                            id="nav"
                            className={`flex items-center px-3 py-2 border-2 rounded text-${this.state?.info?.colors?.text?.color || "white"} hover:text-${this.state?.info?.colors?.text?.color || "white"} border-${this.state?.info?.colors?.text?.color || "gray-white"} hover:text-${this.state?.info?.colors?.text?.shadow || "gray-100"} hover:text-${this.state?.info?.colors?.text?.shadow || "gray-100"} hover:border-${this.state?.info?.colors?.text?.shadow || "gray-100"}`}>
                            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title>
                                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="menu w-full flex-grow lg:flex lg:items-center lg:w-auto lg:px-3 px-8">
                    <div className="text-md font-bold lg:flex-grow">
                        {
                            this.props?.categories?.map(category => {
                                return (
                                    <Link key={category.name} href={'/category/' + encodeURI(category.name)}>
                                        <a className="text-gray-100 hover:text-gray-300 block mt-4 lg:inline-block lg:mt-0 px-4 py-2 rounded mr-2">
                                            {category.name}
                                        </a>
                                    </Link>
                                )
                            })
                        }

                    </div>
                    <form onSubmit={e => {
                        e.preventDefault(); Router.push({
                            pathname: '/search',
                            search: `?q=${this.state.search}`
                        })
                    }} className={`relative mx-auto text-${this.state?.info?.colors?.text?.color || "white"} font-semibold lg:block hidden`}>
                        <label aria-label="search">
                            <input defaultValue={process.browser ? Router.query.q : ""}
                                onChange={e => this.setState({ ...this.props, search: e.target.value })}
                                className={`placeholder-${this.state?.info?.colors?.text?.shadow || "white"} font-semibold border-2 border-${this.state?.info?.colors?.text?.color || "white"} bg-${this.state?.info?.colors?.background?.color || "gray-500"} h-10 pl-2 pr-8 rounded-lg text-sm focus:outline-none`}
                                type="text" name="search" id="search" placeholder="Search" />
                        </label>
                        <button type="submit" aria-label="submit" className={`text-${this.state?.info?.colors?.text?.color || "white"} absolute right-0 top-0 mt-3 mr-2`}>
                            <FaSearch />
                        </button>
                    </form>
                    <div className="flex">
                        {/* <a href="#"
                            className="block text-md px-4 py-2 rounded text-gray-100 hover:text-gray-300 ml-2 font-bold mt-4 lg:mt-0">Sign
                        in</a>

                        <a href="#"
                            className="block text-md px-4 ml-2 py-2 rounded text-gray-100 hover:text-gray-300 font-bold mt-4 lg:mt-0">login</a> */}
                    </div>
                </div>

            </nav>
        )
    }
}

export default Login