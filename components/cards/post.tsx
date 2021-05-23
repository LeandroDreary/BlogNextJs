import React from 'react'
import Link from 'next/link'

interface MyProps {
    title: string;
    link: string;
    image: string;
    description: string;
    info: any;
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
                <div className="px-4 py-2">

                    <div className="cursor-pointer p-4 rounded-md">
                        <div className="grid grid-cols-3">
                            <div className="col-span-3 md:col-span-1 flex justify-center items-center p-3">
                                <Link href={"/post/" + this.state.link}>
                                    <a>
                                        <img className="w-full max-h-64 object-cover" src={this.state?.image} alt={this.state?.title} />
                                    </a>
                                </Link>
                            </div>
                            <div className="col-span-3 md:col-span-2 p-4">
                                <Link href={"/post/" + this.state.link}>
                                    <a>
                                        <h2 className="text-gray-700 font-semibold text-lg">{this.state?.title}</h2>
                                    </a>
                                </Link>
                                <p className="text-gray-600">{this.state.description?.substr(0, 200) + (this.state?.description?.length > 100 ? "..." : "")}</p>
                                <Link href={"/post/" + this.state.link}>
                                    <a>
                                        <button className={`px-3 py-1 my-2 text-${this.props.info?.colors?.text?.color} bg-${this.props.info?.colors?.background?.color} bg-${this.props.info?.colors?.background?.shadow}-h`}>Ler mais</button>
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <hr />
                </div>
            </>
        )
    }
}

export default Post