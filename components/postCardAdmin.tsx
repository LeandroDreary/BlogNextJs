import React from 'react'
import $ from 'jquery'
import { FaWindowClose } from 'react-icons/fa'
import Api from '../services/api'
import Link from "next/link"
import { Outclick } from '.'

interface MyProps {
    post: {
        title?: string;
        link?: string;
        image?: string;
        description?: string;
    };
    info: any;
    reload: () => any;
    editLink: string;
}

interface MyState {
    delete: boolean
}

class Post extends React.Component<MyProps, MyState> {
    constructor(props: any) {
        super(props);
        this.state = { delete: false }
    }

    render() {

        const HandleDeletePopup = () => {
            $("body").css({ "overflow-y": this.state.delete ? "auto" : "hidden" })
            this.setState({ delete: !this.state.delete })
        }

        const HandleDeletePost = () => {
            $("body").css({ "overflow-y": "auto" })
            Api.delete("/api/post?link=" + this.props.post?.link).then(() => {
                this.props.reload()
            })
        }

        return (
            <>
                {
                    this.state.delete ?
                        <div className="h-full w-full top-0 left-0 bg-black opacity-50 z-20 flex justify-center items-center fixed">
                            <Outclick callback={HandleDeletePopup}>
                                <div className="bg-white">
                                    <div className="w-full grid grid-cols-6 bg-red-600">
                                        <div className="col-span-5 text-lg text-white font-semibold p-2">
                                            Apagar postagem
                                        </div>
                                        <div className="col-span-1 p-2 text-right">
                                            <button className="text-lg p-1 text-white" onClick={HandleDeletePopup}><FaWindowClose /></button>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <p className="pb-2 text-gray-800">Você realmente quer apagar a postagem?</p>
                                        <hr className="my-2" />
                                        <button onClick={HandleDeletePost} className="mr-5 mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg">
                                            Apagar
                                        </button>
                                    </div>
                                </div>
                            </Outclick>
                        </div>
                        : ""
                }

                <div className="col-span-4 sm:col-span-2 lg:col-span-1 p-4">
                    <div className="relative h-full pb-16">
                        <div className="cursor-pointer p-4 pb-8 sm:pb-4 h-full rounded-md">
                            <div className="relative flex justify-center items-center mx-1 py-1">
                                <a target="_blank" href={"/post/" + this.props.post.link}>
                                    <img className="w-full h-36 object-cover" src={this.props.post.image || ""} alt={this.props.post.title || ""} />
                                </a>
                            </div>
                            <div className="px-4 pt-1">
                                <a target="_blank" href={"/post/" + this.props.post.link}>
                                    <h2 className="text-gray-700 hover:underline font-semibold text-lg">{this.props.post.title}</h2>
                                </a>
                                <p className="text-gray-600 pt-3 text-sm">{this.props.post.description?.substr(0, 200) + (this.props.post.description.length > 100 ? "..." : "")}</p>
                            </div>
                        </div>
                        <div className="bottom-0 w-full px-4 text-right absolute">
                            <hr className="pt-2" />
                            <Link href={this.props.editLink}>
                                <a>
                                    <button className={`mr-5 bg-${this.props?.info?.colors?.background?.color} hover:bg-${this.props?.info?.colors?.background?.shadow} text-${this.props?.info?.colors?.text?.shadow} hover:text-${this.props?.info?.colors?.text?.color} font-bold py-2 px-6`}>
                                        Editar
                                    </button>
                                </a>
                            </Link>
                            <button onClick={HandleDeletePopup} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6">
                                Apagar
                            </button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Post