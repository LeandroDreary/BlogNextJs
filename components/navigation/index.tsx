import React from 'react'

interface MyProps {
    info: any,
    page: number,
    pages: number,
    callBack: (page: number) => any
}

interface MyState {
    info: any,
    page: number,
    pages: number
}

export default class Login extends React.Component<MyProps, MyState> {
    constructor(props: any) {
        super(props);
        this.state = { ...props }
    }

    componentDidUpdate() {
    }

    render() {
        return (
            <div className="py-4">
                {Number(this.props.page || 1) > 3 ?
                    <button onClick={() => this.props.callBack(1)} className={`m-1 rounded-lg bg-${this.props.info?.colors?.background?.color} hover:bg-${this.props.info?.colors?.background?.shadow} px-3 py-1 text-${this.props.info?.colors?.text?.shadow} hover:text-${this.props.info?.colors?.text?.color}`}>
                        {1}
                    </button> : ""
                }
                {Number(this.props.page || 1) > 4 ?
                    <button className={`m-1 rounded-lg bg-${this.props.info?.colors?.background?.color} hover:bg-${this.props.info?.colors?.background?.shadow} px-3 py-1 text-${this.props.info?.colors?.text?.shadow} hover:text-${this.props.info?.colors?.text?.color}`}>
                        ...
                            </button> : ""
                }
                {Number(this.props.page || 1) > 2 ?
                    <button onClick={() => this.props.callBack(Number(this.props.page || 1) - 2)} className={`m-1 rounded-lg bg-${this.props.info?.colors?.background?.color} hover:bg-${this.props.info?.colors?.background?.shadow} px-3 py-1 text-${this.props.info?.colors?.text?.shadow} hover:text-${this.props.info?.colors?.text?.color}`}>
                        {Number(this.props.page || 1) - 2}
                    </button> : ""
                }
                {Number(this.props.page || 1) > 1 ?
                    <button onClick={() => this.props.callBack(Number(this.props.page || 1) - 1)} className={`m-1 rounded-lg bg-${this.props.info?.colors?.background?.color} hover:bg-${this.props.info?.colors?.background?.shadow} px-3 py-1 text-${this.props.info?.colors?.text?.shadow} hover:text-${this.props.info?.colors?.text?.color}`}>
                        {Number(this.props.page || 1) - 1}
                    </button> : ""
                }
                <button className={`m-1 rounded-lg bg-${this.props.info?.colors?.background?.shadow} px-3 py-1 text-${this.props.info?.colors?.text?.color}`}>
                    {Number(this.props.page || 1)}
                </button>
                {(Number(this.props.page || 1) + 1) <= this.props.pages ?
                    <button onClick={() => this.props.callBack(Number(this.props.page || 1) + 1)} className={`m-1 rounded-lg bg-${this.props.info?.colors?.background?.color} hover:bg-${this.props.info?.colors?.background?.shadow} px-3 py-1 text-${this.props.info?.colors?.text?.shadow} hover:text-${this.props.info?.colors?.text?.color}`}>
                        {Number(this.props.page || 1) + 1}
                    </button> : ""
                }
                {(Number(this.props.page || 1) + 2) <= this.props.pages ?
                    <button onClick={() => this.props.callBack(Number(this.props.page || 1) + 2)} className={`m-1 rounded-lg bg-${this.props.info?.colors?.background?.color} hover:bg-${this.props.info?.colors?.background?.shadow} px-3 py-1 text-${this.props.info?.colors?.text?.shadow} hover:text-${this.props.info?.colors?.text?.color}`}>
                        {Number(this.props.page || 1) + 2}
                    </button> : ""
                }
                {Number(Number(this.props.pages) - Number(this.props.page || 1)) >= 4 ?
                    <button className={`m-1 rounded-lg bg-${this.props.info?.colors?.background?.color} hover:bg-${this.props.info?.colors?.background?.shadow} px-3 py-1 text-${this.props.info?.colors?.text?.shadow} hover:text-${this.props.info?.colors?.text?.color}`}>
                        ...
                            </button> : ""
                }
                {(Number(this.props.page || 1) + 3) <= this.props.pages ?
                    <button onClick={() => this.props.callBack(this.props.pages)} className={`m-1 rounded-lg bg-${this.props.info?.colors?.background?.color} hover:bg-${this.props.info?.colors?.background?.shadow} px-3 py-1 text-${this.props.info?.colors?.text?.shadow} hover:text-${this.props.info?.colors?.text?.color}`}>
                        {this.props.pages}
                    </button> : ""
                }
            </div>
        )
    }
}