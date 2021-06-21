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
            <div className="top-0 sticky pt-2">
                <div className="w-full my-6 rounded border p-3 pt-6 shadow-md">
                    <hr />
                    <div className="py-2">
                        {this.props?.categories?.map(category => {
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
            </div>
        )
    }
}

export default Sidebar