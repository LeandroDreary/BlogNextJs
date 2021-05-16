import React from 'react'
import Link from 'next/link';

interface MyProps {
    categories: {
        name: string,
        color: string
    }[]
}

interface MyState {
    categories: {
        name: string,
        color: string
    }[]
}

class Sidebar extends React.Component<MyProps, MyState> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <>
                <div className="w-full my-6 rounded border p-2 shadow-lg">
                    <p className="text-2xl font-semibold pb-3 mx-2 text-center text-gray-800">Categories</p>
                    <hr />
                    <div className="p-2">
                        {this.props.categories?.map(category => {
                            return (
                                <Link key={category.name} href={'/category/' + encodeURI(category.name)}>
                                    <a>
                                        <button style={{ backgroundColor: category.color }} className="py-2 px-6 rounded text-white font-semibold m-2">
                                            {category.name}
                                        </button>
                                    </a>
                                </Link>
                            )
                        })
                        }
                    </div>
                </div>
            </>
        )
    }
}

export default Sidebar