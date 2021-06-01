import React from 'react'
import Link from 'next/link'

interface MyProps {
    info: any;
    title: string;
    link: string;
    image: string;
    description: string;
}

interface MyState {
    title: string,
    link: string,
    image: string,
    description: string
}

class Post extends React.Component<MyProps, MyState> {
    constructor(props: any) {
        super(props);
        this.state = { ...props, delete: false }
    }

    render() {
        return (
            <>
                <div className="col-span-4 sm:col-span-2 lg:col-span-1 p-4">
                    <div className="relative h-full shadow-md  pb-16 border border-gray-100">
                        <div className="cursor-pointer p-4 pb-6 h-full rounded-md">
                            <div className="relative flex justify-center items-center mx-1 py-1">
                                <Link href={"/post/" + this.props.link || ""}>
                                    <a>
                                        <img className="w-full h-36 object-cover" src={this.props.image || ""} alt={this.props.title || ""} />
                                    </a>
                                </Link>
                            </div>
                            <div className="px-4 pt-1">
                                <Link href={"/post/" + this.props.link}>
                                    <a>
                                        <h2 className="text-gray-900 font-semibold text-lg">{this.props.title}</h2>
                                    </a>
                                </Link>
                                <p className="text-gray-800 text-sm">{this.props.description?.substr(0, 200) + (this.props.description.length > 100 ? "..." : "")}</p>
                            </div>
                        </div>
                        <div className="bottom-0 w-full px-4 text-right absolute">
                            <hr className="pt-2" />
                            <Link href={"/post/" + this.props.link}>
                                <a>
                                    <button className={`bg-${this.props.info?.colors?.background?.color || "gray-500"} mr-1 hover:bg-${this.props.info?.colors?.background?.shadow || "gray-500"} hover:text-${this.props.info?.colors?.text?.shadow || "gray-500"} text-${this.props.info?.colors?.text?.color || "white"} font-extrabold px-4 my-3 py-2`}>
                                        Ler mais
                                    </button>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Post