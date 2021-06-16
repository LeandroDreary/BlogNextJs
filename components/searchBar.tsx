import React from "react";
import { PagesInfoI } from "../services/types";
import { FaSearch } from 'react-icons/fa'

interface datas {
    search: string;
    perPage: number;
    author?: string;
    category?: string;
    authors: {
        name: string;
        link: string;
    }[];
    categories: {
        name: string;
        link: string;
    }[];
}

interface MyProps {
    info: PagesInfoI;
    onSubmit: (e: React.FormEvent<HTMLFormElement>, v: datas, forceUpdate?: () => any) => any;
    datas?: datas;
}

interface MyState {
    defaultDatas: datas;
    datas: datas;
}

class SearchBar extends React.Component<MyProps, MyState> {

    constructor(props) {
        super(props);
        this.state = { datas: this.props.datas, defaultDatas: this.props.datas }
    }

    componentDidUpdate() {
        if (this.props.datas !== this.state.defaultDatas){
            this.setState({ datas: this.props.datas, defaultDatas: this.props.datas })
        }
    }

    render() {
        let HandlePerPageChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
            let value = e.target.valueAsNumber || 12
            try {
                value = value < 8 ? 8 : value
                value = value > 30 ? 30 : value
            } catch (e) { value = 12 }
            e.target.value = value.toString()
            this.setState({ datas: { ...this.state.datas, perPage: value } })
        }

        let HandleSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
            this.setState({ datas: { ...this.state.datas, search: e.target.value } })
        }

        let HandleAuthorChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
            this.setState({ datas: { ...this.state.datas, author: e.target.value } })
        }

        let HandleCategoryChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
            this.setState({ datas: { ...this.state.datas, category: e.target.value } })
        }

        return (
            <div className="box pt-4">
                <form onSubmit={(e) => this.props.onSubmit(e, this.state.datas)}>
                    <div className="mx-4">
                        <div className={`bg-${this.props.info?.colors?.background?.color} p-4 shadow-md box-wrapper`}>
                            <div className={`flex items-center w-full px-3 py-2 shadow-sm border border-${this.props.info?.colors?.text?.color} text-${this.props.info?.colors?.text?.color}`}>
                                <input onChange={HandleSearchChange} value={this.state.datas?.search || ""} type="text" placeholder="Procurar" x-model="q" className={`placeholder-${this.props.info?.colors?.text?.shadow} font-semibold w-full text-sm outline-none focus:outline-none bg-transparent`} />
                                <button className="outline-none focus:outline-none px-4">
                                    <FaSearch />
                                </button>
                            </div>
                        </div>
                        <div className="py-4 bg-white border px-4">
                            <div className="inline-block px-3">
                                <label className="text-gray-600" htmlFor="category">Categoria</label><br />
                                <select name="category" value={this.state.datas.category} onChange={HandleCategoryChange} className={`text-sm w-32 text-gray-600 border border-gray-300 outline-none focus:outline-none p-1`}>
                                    <option value="">Todos</option>
                                    {
                                        this.state.datas?.categories?.map(category => {
                                            return <option key={category.link} className={`bg-white text-gray-700`} value={category.link || ""}>{category.name || ""}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="inline-block px-3">
                                <label className="text-gray-600" htmlFor="author">Autor</label><br />
                                <select name="author" value={this.state.datas.author} onChange={HandleAuthorChange} className={`text-sm w-32 text-gray-600 border border-gray-300 outline-none focus:outline-none p-1`}>
                                    <option value="">Todos</option>
                                    {
                                        this.state.datas?.authors?.map(author => {
                                            return <option key={author.link} className={`bg-white text-gray-700`} value={author.link || ""}>{author.name || ""}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="inline-block px-3">
                                <label className="text-gray-600" htmlFor="perPage">Por página</label><br />
                                <input onChange={HandlePerPageChange} value={this.state.datas.perPage || 12} className="text-gray-600 w-16 border border-gray-300 px-2 py-1" name="perPage" type="number" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default SearchBar