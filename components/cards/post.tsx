import React from 'react'
import Link from 'next/link'

interface MyProps {
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
                <div className="px-4 py-2">
                    <Link href={"/post/" + this.state.link}>
                        <a>
                            <div className="cursor-pointer p-4 border shadow-lg rounded-md">
                                <div className="grid grid-cols-3">
                                    <div className="col-span-3 md:col-span-1 flex justify-center items-center p-3">
                                        <img className="w-full max-h-64 object-cover" src={this.state?.image} alt={this.state?.title} />
                                    </div>
                                    <div className="col-span-3 md:col-span-2 p-4">
                                        <h2 className="text-gray-900 font-semibold text-lg">{this.state?.title}</h2>
                                        <p className="text-gray-800">{this.state.description?.substr(0, 200) + (this.state?.description?.length > 100 ? "..." : "")}</p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </Link>
                </div>
            </>
        )
    }
}

export default Post