import React from 'react'
import $ from 'jquery'
import { FaWindowClose } from 'react-icons/fa'
import Api from '../services/api'
import Router from 'next/router'

interface MyProps {
    title: string;
    link: string;
    image: string;
    description: string;
    info: any;
    reload: () => any;
}

interface MyState {
    title: string,
    link: string,
    image: string,
    description: string,
    delete: boolean,
    info: any,
    reload: () => any
}

class Post extends React.Component<MyProps, MyState> {
    constructor(props: any) {
        super(props);
        this.state = { ...props, delete: false }
    }

    render() {

        const HandleDeletePopup = () => {
            $("body").css({ "overflow-y": this.state.delete ? "auto" : "hidden" })
            this.setState({ ...this.props, delete: !this.state.delete })
        }

        const HandleDeletePost = () => {
            $("body").css({ "overflow-y": "auto" })
            Api.delete("/api/post?link=" + this.state.link).then(() => {
                this.state.reload()
            })
        }

        return (
            <>
                {
                    this.state.delete ?
                        <div className="h-full w-full top-0 left-0 fixed">
                            <div onClick={HandleDeletePopup} className="bg-black opacity-50 h-full w-full z-10 absolute">
                            </div>
                            <div className="h-full w-full flex justify-center items-center z-20">
                                <div className="bg-white rounded z-20">
                                    <div className="w-full grid grid-cols-6 bg-red-600">
                                        <div className="col-span-5 text-lg text-white font-semibold p-2">
                                            Apagar post
                                        </div>
                                        <div className="col-span-1 p-2 text-right">
                                            <button className="text-lg p-1 text-white" onClick={HandleDeletePopup}><FaWindowClose /></button>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <p className="pb-2 text-gray-800">Você quer realmente apagar o post?</p>
                                        <hr className="my-2" />
                                        <button onClick={HandleDeletePost} className="mr-5 mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg">
                                            Apagar
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                        : ""
                }

                <div className="p-4">
                    <div className="p-4 border shadow-md rounded">
                        <div className="grid grid-cols-3">
                            <div className="col-span-3 md:col-span-1 flex justify-center items-center p-3">
                                <img className="w-full max-h-64 object-cover" src={this.state?.image} alt={this.state?.title} />
                            </div>
                            <div className="col-span-3 md:col-span-2 p-4">
                                <h2 className="text-gray-900 font-semibold text-lg">{this.state.title}</h2>
                                <p className="text-gray-800">{this.state.description?.substr(0, 200) + (this.state?.description?.length > 100 ? "..." : "")}</p>
                            </div>
                        </div>
                        <hr className="mt-3" />
                        <div className="p-4">
                            <a href={'/admin/post/edit/' + encodeURI(this.state?.link)}>
                                <button className={`mr-5 bg-${this.state?.info?.colors?.background?.color} hover:bg-${this.state?.info?.colors?.background?.shadow} text-${this.state?.info?.colors?.text?.shadow} hover:text-${this.state?.info?.colors?.text?.color} font-bold py-2 px-6 rounded-lg`}>
                                    Editar
                                </button>
                            </a>
                            <button onClick={HandleDeletePopup} className="mr-5 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg">
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