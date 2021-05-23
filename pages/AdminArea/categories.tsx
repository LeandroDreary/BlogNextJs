import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import $ from 'jquery'
import Cookies from 'cookies'
import { FaSearch, FaWindowClose } from 'react-icons/fa'
import Api from '../../services/api'
import Navbar from '../../components/navbar_admin_area'
import '../../components/LoadClasses'
import Navigation from '../../components/navigation'
import { GetServerSideProps } from 'next'
import bcrypt from 'bcryptjs'
import DbConnect, { Config } from '../../database/connection'
import ReactHtmlParser from 'react-html-parser'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    await DbConnect()
    const cookies = new Cookies(req, res)
    let info
    try {
        info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
        info = info._doc.content
    } catch (e) { }

    if (bcrypt.compareSync(`${process.env.ADMINPASSWORD}_${process.env.ADMINUSERNAME}`, (cookies.get('AdminAreaAuth') || ""))) {
        return {
            props: {
                info,
                user: { username: process.env.ADMINUSERNAME }
            }
        }
    } else {
        return {
            redirect: {
                destination: '/AdminArea/signin',
                permanent: false,
            }
        }
    }
}

const Index = ({ info, user }) => {

    const [categories, setCategories] = useState<{ _id: string, name: string, color: string }[]>()
    const [categoriesEdit, setCategoriesEdit] = useState<{ _id: string, name: string, color: string }[]>()
    const [deletePopup, setDeletePopup] = useState<{ _id: string, name: string, show: boolean, able: boolean }>({ _id: "", name: "", show: false, able: false })
    const [createPopup, setCreatePopup] = useState<{ show: boolean, able: boolean }>({ show: false, able: false })
    const [categoryForm, setCategoryForm] = useState<{ name: string, color: string }>({ name: "", color: "" })
    const [filters, setFilters] = useState<{ perPage: number, page: number, pages: number, search: string, category: string }>({ search: "", page: 1, pages: 0, category: undefined, perPage: 12 })
    const [loading, setLoading] = useState<boolean>(false);
    let deer = false
    const LoadCategories = (page?: number, perPage?: number, search?: string) => {
        setLoading(true)
        Api.get(`/api/category/list?${`page=${page || filters.page || 1}&`
            }${`perPage=${perPage || filters.perPage || 1}&`
            }${(search || filters.search) ? `search=${search || filters.search || ""}` : ""
            }`, { withCredentials: true }).then(response => {
                setCategoriesEdit(response.data?.result?.map(category => { return { _id: category?._id, name: category?.name, color: category?.color } }))
                setCategories(response.data?.result)
                setFilters({ ...filters, ...response.data })
                setLoading(false)
            })
    }

    const HandleSubmit = (id: string, e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        Api.put('/api/category', categoriesEdit?.filter(c => c._id === id)[0], { withCredentials: true }).then(response => {
            if (response.data?.result) {
                Api.get(`/api/category/list?${`page=${filters.page || 1}&`
                    }${`perPage=${filters.perPage || 12}&`
                    }${(filters.search) ? `search=${filters.search || ""}` : ""
                    }`).then(response => {
                        setCategories(response.data?.result)
                    })
            }
        })
    }

    const HandleDelete = () => {
        Api.delete(`/api/category?_id=${deletePopup._id}`, { withCredentials: true }).then(async response => {
            setCategoriesEdit(categoriesEdit.filter(category => category._id !== deletePopup._id))
            await Api.get(`/api/category/list?${`page=${filters.page || 1}&`
                }${`perPage=${filters.perPage || 12}&`
                }${(filters.search) ? `search=${filters.search || ""}` : ""
                }`).then(response => {
                    setCategories(response.data?.result)
                })
            setDeletePopup({ ...deletePopup, show: false })
            $("body").css({ "overflow-y": "auto" })
        })
    }

    const CreateCategory = () => {
        Api.post('/api/category', categoryForm, { withCredentials: true }).then(response => {
            LoadCategories()
            setCreatePopup({ ...deletePopup, show: false })
            $("body").css({ "overflow-y": "auto" })
        })
    }

    useEffect(() => {
        LoadCategories()
    }, [])

    return (
        <>
            {
                deletePopup.show ?
                    <div className="h-full w-full top-0 left-0 fixed">
                        <div onClick={() => { $("body").css({ "overflow-y": "auto" }); setDeletePopup({ ...deletePopup, show: false }) }} className="bg-black opacity-50 h-full w-full z-10 absolute">
                        </div>
                        <div className="h-full w-full flex justify-center items-center z-20">
                            <div className="bg-white rounded z-20">
                                <div className="w-full grid grid-cols-6 bg-red-600">
                                    <div className="col-span-5 text-lg text-white font-semibold p-2">
                                        Apagar categoria
                                    </div>
                                    <div className="col-span-1 p-2 text-right">
                                        <button className="text-lg p-1 text-white" onClick={() => { $("body").css({ "overflow-y": "auto" }); setDeletePopup({ ...deletePopup, show: false }) }}><FaWindowClose /></button>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <p className="pb-2 text-gray-800">Você quer realmente apagar essa categoria? Coloque o nome da categoria para confirmar.</p>
                                    <p className="pb-2 font-semibold text-gray-800">{deletePopup?.name}</p>
                                    <input onChange={e => setDeletePopup({ ...deletePopup, able: e.target.value === deletePopup.name })} className="shadow appearance-none font-semibold text-gray-700 border rounded w-64 py-1 px-3 text-grey-400 mx-auto" type="text" />
                                    <hr className="my-2" />
                                    {deletePopup.able ?
                                        <button onClick={HandleDelete} type="button" className="mr-5 mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg">
                                            Apagar
                                        </button> :
                                        <div className="pt-4 pb-1">
                                            <span className="mr-5 bg-gray-100 text-gray-800 font-bold py-2 px-6 rounded-lg">
                                                Apgar
                                            </span>
                                        </div>
                                    }
                                </div>

                            </div>
                        </div>
                    </div>
                    : ""
            }
            {
                createPopup.show ?
                    <div className="h-full w-full top-0 left-0 fixed">
                        <div onClick={() => { $("body").css({ "overflow-y": "auto" }); setCreatePopup({ ...createPopup, show: false }) }} className="bg-black opacity-50 h-full w-full z-10 absolute">
                        </div>
                        <div className="h-full w-full flex justify-center items-center z-20">
                            <div className="bg-white rounded z-20">
                                <div className="w-full grid grid-cols-6 bg-red-600">
                                    <div className="col-span-5 text-lg text-white font-semibold p-2">
                                        Criar categoria
                                    </div>
                                    <div className="col-span-1 p-2 text-right">
                                        <button className="text-lg p-1 text-white" onClick={() => { $("body").css({ "overflow-y": "auto" }); setCreatePopup({ ...createPopup, show: false }) }}><FaWindowClose /></button>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <input onChange={e => { setCreatePopup({ ...createPopup, able: e.target.value !== "" }); setCategoryForm({ ...categoryForm, name: e.target.value }) }} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="CategoryName" type="text" id="CategoryName" placeholder="Category Name" />
                                    <input onChange={e => { setCategoryForm({ ...categoryForm, color: e.target.value }) }} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="CategoryColor" type="color" id="CategoryColor" placeholder="Category Color" />
                                    <hr className="my-2" />
                                    {createPopup.able ?
                                        <button onClick={CreateCategory} type="button" className="mr-5 mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg">
                                            Nova categoria
                                        </button> :
                                        <div className="pt-4 pb-1">
                                            <span className="mr-5 bg-gray-100 text-gray-800 font-bold py-2 px-6 rounded-lg">
                                                Nova categoria
                                            </span>
                                        </div>
                                    }
                                </div>

                            </div>
                        </div>
                    </div>
                    : ""
            }
            <Head>
                <title>Categorias</title>
                {ReactHtmlParser(info?.customLayoutStyles)}
            </Head>
            <Navbar info={info} user={user} />
            <div className="container mx-auto">
                <div className="grid grid-cols-12">
                    <div className="col-span-12">
                        <button onClick={() => { $("body").css({ "overflow-y": "hidden" }); setCreatePopup({ show: true, able: false }) }} className={`mr-5 my-4 bg-${info?.colors.background?.color} hover:bg-${info?.colors.background?.shadow} text-${info?.colors.text?.shadow} hover:text-${info?.colors.text?.color} font-bold py-2 px-6 rounded-lg`}>
                            Nova categoria
                        </button>
                        <button onClick={() => LoadCategories()} className="mr-5 my-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg">
                            Recarregar
                        </button>
                        <hr />
                    </div>
                </div>
                <div className="box pt-6">
                    <form onSubmit={(e) => { e.preventDefault(); LoadCategories(); }}>
                        <div className={`bg-${info?.colors.background?.color} py-4 px-6 mx-4 rounded-lg shadow-md box-wrapper`}>
                            <div className={`rounded flex items-center w-full p-3 shadow-sm border border-${info?.colors?.text?.color} text-${info?.colors?.text?.color}`}>
                                <input onChange={e => setFilters({ ...filters, search: e.target.value })} type="search" placeholder="search" x-model="q" className={`placeholder-${info?.colors?.text?.shadow} font-semibold w-full text-sm outline-none focus:outline-none bg-transparent`} />
                                <button type="submit" className="outline-none focus:outline-none px-4">
                                    <FaSearch />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="grid grid-cols-6">
                    <div className="col-span-6">
                        <Navigation callBack={page => LoadCategories(page)} info={info} page={filters.page} pages={filters.pages} />
                        <hr />
                    </div>
                    <div className="col-span-1">
                    </div>
                    <div className="col-span-6 sm:col-span-4 mx-4">
                        {!loading ?
                            categoriesEdit?.map(category => {
                                return (
                                    <form onSubmit={e => HandleSubmit(category?._id, e)} className="grid grid-cols-3 shadow border my-4 rounded" key={category._id}>
                                        <div className="col-span-3 sm:col-span-2 grid grid-cols-2 mx-auto">
                                            <div className="col-span-1 ml-4 flex items-center">
                                                <input className="shadow appearance-none font-semibold text-gray-700 border rounded w-64 py-2 px-3 my-4 text-grey-400 mx-auto" onChange={e => setCategoriesEdit(categoriesEdit.map(c => { if (c._id === category._id) { return { ...c, name: e.target.value } } else return c }))} value={category?.name} type="text" />
                                            </div>
                                            <div className="col-span-1 flex items-center justify-end sm:justify-center">
                                                <input className="mr-4 sm:mr-0" onChange={e => setCategoriesEdit(categoriesEdit.map(c => { if (c._id === category._id) { return { ...c, color: e.target.value } } else return c }))} value={category?.color} name={"color_selector_" + category._id} type="color" />
                                            </div>
                                        </div>
                                        <div className="col-span-3 sm:col-span-1 flex items-center">
                                            <div className="mx-auto flex items-center">
                                                {
                                                    (categories?.filter(c => c._id === category._id)[0].name !== category.name ||
                                                        categories?.filter(c => c._id === category._id)[0].color !== category.color) ?
                                                        <button className="my-4 text-white font-semibold px-4 mx-2 py-2" style={{ backgroundColor: category.color }} type="submit">
                                                            Salvar
                                                    </button> :
                                                        <div className="my-4 text-gray-800 font-semibold px-4 py-2 mx-2 bg-gray-200  cursor-pointer">
                                                            Salvar
                                                    </div>
                                                }
                                                <div onClick={() => { $("body").css({ "overflow-y": "hidden" }); setDeletePopup({ _id: category._id, name: categories?.filter(c => c._id === category._id)[0].name, show: true, able: false }) }} className="my-4 text-white font-semibold px-4 py-2 bg-red-700 hover:bg-red-800 mx-2 cursor-pointer">
                                                    Apagar
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                )
                            }) :
                            <div className="flex justify-center items-center h-64">
                                <img src="https://www.wallies.com/filebin/images/loading_apple.gif" alt="loading" className="w-12" />
                            </div>
                        }
                    </div>
                    <div className="col-span-6">
                        <hr />
                        <Navigation callBack={page => LoadCategories(page)} info={info} page={filters.page} pages={filters.pages} />
                    </div>
                </div>
            </div>
        </>
    )
}


export default Index