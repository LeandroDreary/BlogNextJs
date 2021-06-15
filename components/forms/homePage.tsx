import React from 'react'
import api from '../../services/api';
import FormData from 'form-data'

interface HomePageInfo {
    title: string,
    description: string,
    banner: string,
    head: string
}

interface MyProps {
    info: any,
    homePageInfo: HomePageInfo
}

interface MyState {
    homePageInfo: HomePageInfo,
    homePageInfoInputs: HomePageInfo,
    bannerInput: {
        preview: any,
        file: File
    }
    loading: boolean;
}

class Login extends React.Component<MyProps, MyState> {

    constructor(props: any) {
        super(props);
        this.state = { loading: false, homePageInfo: this.props.homePageInfo, homePageInfoInputs: this.props.homePageInfo, bannerInput: { preview: null, file: null } }
    }

    render() {

        const HandleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            this.setState({ loading: true })
            e.preventDefault();
            let data = new FormData();

            data.append('banner', this.state.bannerInput?.file || this.state.homePageInfoInputs?.banner || "");
            data.append('description', this.state.homePageInfoInputs?.description);
            data.append('head', this.state.homePageInfoInputs?.head);
            data.append('title', this.state.homePageInfoInputs?.title);
            data.append('name', "homePageInfo");

            api.post('/api/config', data, { withCredentials: true, headers: { 'content-type': 'multipart/form-data' } }).then(res => {
                this.setState({ ...this.state, homePageInfo: res.data?.content, homePageInfoInputs: res.data?.content })
                this.setState({ loading: false })
            }).catch(() => this.setState({ loading: false }))

        }

        return (
            <form onSubmit={HandleFormSubmit}>
                <div className="grid grid-cols-3 my-6 border shadow-lg text-center md:text-left">
                    <div className={"col-span-3 bg-" + (this.props.info?.colors?.background?.shadow || "gray-500")}>
                        <h2 className={`font-semibold text-2xl my-2 mx-4 text-${this.props.info?.colors?.text?.color || "white"}`}>Página Inicial</h2>
                    </div>
                    <div className="col-span-3 md:col-span-1 pt-4 pb-4 px-4">
                        <div className="py-1">
                            <label htmlFor="websiteName" className="font-semibold text-gray-700">Título: </label><br />
                            <input value={this.state.homePageInfoInputs?.title} onChange={e => this.setState({ homePageInfoInputs: { ...this.state.homePageInfoInputs, title: e.target.value } })} className="shadow w-64 appearance-none border max-w-full rounded py-1 px-3 text-gray-700" type="text" name="websiteName" />
                        </div>
                        <div className="py-1">
                            <label htmlFor="description" className="font-semibold text-gray-700">Descrição: </label><br />
                            <textarea value={this.state.homePageInfoInputs?.description} onChange={e => this.setState({ homePageInfoInputs: { ...this.state.homePageInfoInputs, description: e.target.value } })} className="shadow w-64 appearance-none border max-w-full rounded py-1 px-3 text-gray-700" name="description"></textarea>
                        </div>
                        <div className="py-1">
                            <label htmlFor="description" className="font-semibold text-gray-700">Html HEAD: </label><br />
                            <textarea value={this.state.homePageInfoInputs?.head} onChange={e => this.setState({ homePageInfoInputs: { ...this.state.homePageInfoInputs, head: e.target.value } })} className="shadow w-64 appearance-none border max-w-full rounded py-1 px-3 text-gray-700" name="description"></textarea>
                        </div>
                    </div>
                    <div className="col-span-3 md:col-span-1 pt-4 pb-4 px-4">
                        <span className="font-semibold text-gray-700 py-1">Banner: </span>
                        <div className="py-3">
                            <label aria-label="Banner">
                                <input className="hidden" onChange={e =>
                                    this.setState({ bannerInput: { file: e.target.files[0], preview: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : undefined } })
                                } type="file" id="file" name="icon" accept="image/x-png,image/jpeg,image/webp" />
                                <div className="pb-4">
                                    <span className={`bg-${this.props.info?.colors?.background?.color} mt-4 hover:bg-${this.props.info?.colors?.background?.shadow} rounded px-4 py-2 text-${this.props.info?.colors?.text?.shadow} hover:text-${this.props.info?.colors?.text?.color} text-custom2-h font-semibold`}>Escolher Banner</span>
                                </div>

                                <div style={{ maxWidth: "25em" }} className={`w-full h-44 p-4 bg-${this.props.info?.colors?.background?.color} shadow-lg border border-${this.props.info?.colors?.background?.shadow}`}>
                                    {this.state.bannerInput?.preview ?
                                        <img id="icon-img" alt="icon" src={this.state.bannerInput?.preview} className={`mx-auto shadow-lg h-full`} />
                                        :
                                        <div>

                                        </div>
                                    }
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="col-span-3 mb-4 mt-2 text-center">
                        <hr className="mx-4" />
                        {
                            this.state.loading ?
                                <img src="/img/load.gif" className="h-12 mx-auto my-3" alt="carregando" /> :
                                this.state.homePageInfo === this.state.homePageInfoInputs ?
                                    <button className="bg-gray-100 mt-4 hover:bg-gray-200 rounded px-4 py-2 text-gray-900 font-semibold" type="button">Salvar</button>
                                    :
                                    <button className={`bg-${this.props.info?.colors?.background?.color} mt-4 hover:bg-${this.props.info?.colors?.background?.shadow} rounded px-4 py-2 text-${this.props.info?.colors?.text?.shadow} hover:text-${this.props.info?.colors?.text?.color} font-semibold`} type="submit">Salvar</button>
                        }
                    </div>
                </div>
            </form>
        )
    }
}

export default Login