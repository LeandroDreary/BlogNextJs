import React from 'react'
import { FaFacebook, FaTwitter, FaDiscord } from 'react-icons/fa'
interface MyProps {
    info: any
}

interface MyState {
    info: any
}

class Login extends React.Component<MyProps, MyState> {

    constructor(props: any) {
        super(props);
        this.state = { ...props }
    }

    render() {

        return (
            <footer className={`footer bg-${this.props?.info?.colors?.background?.color} relative mt-4 pt-1 border-b-2 border-${this.props?.info?.colors?.background?.shadow}`}>
                <div className="container mx-auto px-6">

                    <div className="sm:flex sm:mt-8">
                        <div className="mt-8 sm:mt-0 sm:w-full sm:px-8 flex flex-col md:flex-row justify-between">
                            <div className="flex flex-col">
                                <span className={`font-bold text-${this.props?.info?.colors?.text?.color || "gray-500"} uppercase mb-2`}>Redes sociais</span>
                                <div className="flex items-center">
                                    <a href="https://twitter.com/pequenojornal" className={`text-${this.props?.info?.colors?.text?.color || "gray-500"} my-2 mr-4 flex items-center text-md hover:text-${this.props?.info?.colors?.text?.shadow || "gray-500"} items-center`}>
                                        <span className="pr-2">
                                            Twitter
                                            </span>
                                        <span>
                                            <FaTwitter />
                                        </span>
                                    </a>
                                    <a href="https://discord.gg/gou" className={`text-${this.props?.info?.colors?.text?.color || "gray-500"} my-2 flex flex items-center text-md hover:text-${this.props?.info?.colors?.text?.shadow || "gray-500"} items-center`}>
                                        <span className="mr-2">
                                            Discord
                                        </span>
                                        <span>
                                            <FaDiscord />
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-6">
                    <div className={`mt-8 border-t-2 border-${this.props?.info?.colors?.text?.color || "gray-500"} flex flex-col items-center`}>
                        <div className="sm:w-2/3 text-center py-6">
                            <p className={`text-sm text-${this.props?.info?.colors?.text?.color || "gray-500"} font-bold mb-2`}>
                                © 2021 com ❤️ por {this.props?.info?.websiteName || "Dreary"}
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }
}

export default Login