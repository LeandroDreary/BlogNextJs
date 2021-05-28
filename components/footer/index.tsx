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
            <footer className={`footer bg-${this.state?.info?.colors?.background?.color || "gray-500"} relative mt-4 pt-1 border-b-2 border-${this.state?.info?.colors?.background?.shadow || "gray-700"}`}>
                <div className="container mx-auto px-6">

                    <div className="sm:flex sm:mt-8">
                        <div className="mt-8 sm:mt-0 sm:w-full sm:px-8 flex flex-col md:flex-row justify-between">
                            <div className="flex flex-col">
                                <span className={`font-bold text-${this.state?.info?.colors?.text?.color || "gray-500"} uppercase mb-2`}>Redes sociais</span>
                                <div className="flex items-center">
                                    <span className="my-2 mr-4 flex items-center"><a href="" className={`text-${this.state?.info?.colors?.text?.color || "gray-500"} text-md hover:text-${this.state?.info?.colors?.text?.shadow || "gray-500"} items-center`}><span className="pr-2 inline-flex">Twitter</span><span className="inline-flex"><FaTwitter /></span></a></span>
                                    <span className="my-2 flex flex items-center"><a href="https://discord.gg/gou" className={`text-${this.state?.info?.colors?.text?.color || "gray-500"} text-md hover:text-${this.state?.info?.colors?.text?.shadow || "gray-500"} items-center`}><span className="pr-2 inline-flex">Discord</span><span className="inline-flex"><FaDiscord /></span></a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-6">
                    <div className={`mt-8 border-t-2 border-${this.state?.info?.colors?.text?.color || "gray-500"} flex flex-col items-center`}>
                        <div className="sm:w-2/3 text-center py-6">
                            <p className={`text-sm text-${this.state?.info?.colors?.text?.color || "gray-500"} font-bold mb-2`}>
                                © 2021 com ❤️ por {this.state?.info?.websiteName || "Dreary"}
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }
}

export default Login