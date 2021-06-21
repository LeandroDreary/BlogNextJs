import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { Document } from 'mongoose'
import $ from 'jquery'
import { FaSearch, FaWindowClose } from 'react-icons/fa'
import Api from '../../services/api'
import { Navigation, Outclick } from './../../components'
import { Config, ConfigI } from '../../database/models'
import DbConnect from './../../utils/dbConnect'
import LayoutAdminArea from '../../layout/layoutAdmin'
import { AdminAuth } from '../../utils/authentication'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    return AdminAuth({ req, res }, async ({ user }) => {
        await DbConnect()

        let info: ConfigI & Document<any, any>
        try {
            info = await Config.findOne({ name: "info" }).select(`-_id`).exec()
        } catch (e) { }

        return {
            props: {
                info: info.toJSON()?.content,
                user
            }
        }
    })
}

const Index = ({ info, user }) => {

    const [categories, setCategories] = useState<{ _id: string, name: string, color: string }[]>()
    const [categoriesEdit, setCategoriesEdit] = useState<{ _id: string, name: string, color: string, loading: boolean }[]>()
    const [filters, setFilters] = useState<{ perPage: number, page: number, pages: number, search: string, category: string }>({ search: "", page: 1, pages: 0, category: undefined, perPage: 12 })
    const [loading, setLoading] = useState<boolean>(false);

    const [deleteInputValue, setDeleteInputValue] = useState<String>("");

    const [idToDelete, setIdToDelete] = useState<string>("")

    // Create form
    const [categoryForm, setCategoryForm] = useState<{ name: string, color: string }>({ name: "", color: "" })

    const [popup, setPopup] = useState<"create" | "delete" | "">("")


    const LoadCategories = async ({ page, perPage, search, sl = true }: { page?: number, perPage?: number, search?: string, sl?: boolean }) => {
        if (sl)
            setLoading(true)
        const params = {
            perPage: `${perPage || 12}`,
            page: `${page || 1}`,
            search: `${search || ""}`,
            requestAs: "admin"
        };
        await Api.get(`/api/category/list`, { params, withCredentials: true }).then(response => {
            setCategoriesEdit(response.data?.result)
            setCategories(response.data?.result)
            setFilters({ ...filters, ...response.data, ...params })
            setLoading(false);
        }).catch(() => setLoading(false))
    }

    const HandleSubmit = async (id: string, e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCategoriesEdit(categoriesEdit.map(c => c._id === id ? { ...c, loading: true } : c))
        await Api.put(`/api/category`, categoriesEdit?.filter(c => c._id === id)[0], { withCredentials: true }).then(async res => {
            if (res.data?.result)
                await LoadCategories({ sl: false })
        }).catch(() => { })
        setCategoriesEdit(categoriesEdit.map(c => c._id === id ? { ...c, loading: false } : c))
    }

    const HandleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await Api.delete(`/api/category`, { params: { _id: idToDelete }, withCredentials: true }).then(res => {
            LoadCategories({})
            $("body").css({ "overflow-y": "auto" })
            setPopup("")
        })
    }

    const CreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await Api.post('/api/category', categoryForm, { withCredentials: true }).then(res => {
            LoadCategories({})
            $("body").css({ "overflow-y": "auto" })
            setPopup("")
        })
    }

    useEffect(() => {
        LoadCategories({})
    }, [])
    return (
        <>
            {
                popup !== "" ?
                    <div className="h-full w-full top-0 left-0 flex justify-center items-center bg-black bg-opacity-50 fixed z-20">
                        <Outclick callback={() => { $("body").css({ "overflow-y": "auto" }); setPopup("") }}>
                            {
                                {
                                    "create":
                                        <form onSubmit={CreateCategory} className="bg-white rounded z-20">
                                            <div className={`w-full p-2 grid grid-cols-6 bg-${info?.colors.background?.color} text-${info?.colors.text?.shadow}`}>
                                                <div className="col-span-5 text-lg text-white font-semibold p-2">
                                                    Criar categoria
                                                </div>
                                                <div className="col-span-1 p-2 text-right">
                                                    <button className="text-lg p-1 text-white" onClick={() => { $("body").css({ "overflow-y": "auto" }); setPopup(""); }}><FaWindowClose /></button>
                                                </div>
                                            </div>
                                            <div className="p-5">
                                                <input onChange={e => { setCategoryForm({ ...categoryForm, name: e.target.value }) }} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="CategoryName" type="text" id="CategoryName" placeholder="Nome da categoria" />
                                                <input onChange={e => { setCategoryForm({ ...categoryForm, color: e.target.value }) }} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="CategoryColor" type="color" id="CategoryColor" placeholder="Cor da categoria" />
                                                <hr className="my-2" />
                                                {true ?
                                                    <button type="submit" className={`mr-5 mt-2 font-bold py-2 px-6 bg-${info?.colors.background?.color} hover:bg-${info?.colors.background?.shadow} text-${info?.colors.text?.shadow} hover:text-${info?.colors.text?.color}`}>
                                                        Nova categoria
                                                    </button> :
                                                    <div className="pt-4 pb-1">
                                                        <span className="mr-5 bg-gray-100 text-gray-800 font-bold py-2 px-6">
                                                            Nova categoria
                                                        </span>
                                                    </div>
                                                }
                                            </div>
                                        </form>,
                                    "delete":
                                        <form onSubmit={HandleDelete} className="bg-white rounded z-20">
                                            <div className={`w-full p-2 grid grid-cols-6 bg-${info?.colors.background?.color} text-${info?.colors.text?.shadow}`}>
                                                <div className="col-span-5 text-lg text-white font-semibold p-2">
                                                    Apagar categoria
                                                </div>
                                                <div className="col-span-1 p-2 text-right">
                                                    <button className="text-lg p-1 text-white" onClick={() => { $("body").css({ "overflow-y": "auto" }); setPopup("") }}><FaWindowClose /></button>
                                                </div>
                                            </div>
                                            <div className="p-5">
                                                <p className="pb-2 text-gray-800">Você quer realmente apagar essa categoria? Coloque o nome da categoria para confirmar.</p>
                                                <p className="pb-2 font-semibold text-gray-800">{categories.find(category => category._id === idToDelete)?.name}</p>
                                                <input onChange={(e => setDeleteInputValue(e.target.value))} className="shadow appearance-none font-semibold text-gray-700 border rounded w-64 py-1 px-2 text-grey-400 mx-auto" type="text" />
                                                <hr className="my-2" />
                                                {deleteInputValue === categories.find(category => category._id === idToDelete)?.name ?
                                                    <button type="submit" className="mr-5 mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6">
                                                        Apagar
                                                    </button> :
                                                    <div className="pt-4 pb-1">
                                                        <span className="mr-5 bg-gray-100 text-gray-800 font-bold py-2 px-6 rounded-lg">
                                                            Apagar
                                                        </span>
                                                    </div>
                                                }
                                            </div>
                                        </form>
                                }[popup]
                            }
                        </Outclick>
                    </div> : ""
            }

            < LayoutAdminArea head={<title>Categorias - {info?.websiteName}</title>} info={info} user={user}>
                <div className="container mx-auto">
                    <button onClick={() => { $("body").css({ "overflow-y": "hidden" }); setPopup("create") }} className={`mr-5 my-4 bg-${info?.colors.background?.color} hover:bg-${info?.colors.background?.shadow} text-${info?.colors.text?.shadow} hover:text-${info?.colors.text?.color} font-bold py-2 px-6 rounded-lg`}>
                        Nova categoria
                    </button>
                    <button onClick={() => LoadCategories({})} className="mr-5 my-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg">
                        Recarregar
                    </button>
                    <hr />
                    <form onSubmit={(e) => { e.preventDefault(); LoadCategories({}); }}>
                        <div className={`bg-${info?.colors.background?.color} mt-4 p-4 mx-4 shadow-md box-wrapper`}>
                            <div className={`flex items-center w-full px-3 py-2 shadow-sm border border-${info?.colors?.text?.color} text-${info?.colors?.text?.color}`}>
                                <input onChange={e => setFilters({ ...filters, search: e.target.value })} type="search" placeholder="Procurar" x-model="q" className={`placeholder-${info?.colors?.text?.shadow} font-semibold w-full text-sm outline-none focus:outline-none bg-transparent`} />
                                <button type="submit" className="outline-none focus:outline-none px-4">
                                    <FaSearch />
                                </button>
                            </div>
                        </div>
                    </form>
                    <Navigation callBack={page => LoadCategories({ page })} info={info} page={filters.page} pages={filters.pages} />
                    <hr />
                    <div className="grid grid-cols-6">
                        <div className="col-span-1">
                        </div>
                        <div className="col-span-6 lg:col-span-4 mx-4">
                            {!loading ?
                                categoriesEdit?.map((category, i) => {
                                    return (
                                        <form onSubmit={e => HandleSubmit(category?._id, e)} className="grid grid-cols-3 bg-white border my-4 rounded" key={category._id}>
                                            <div className="col-span-3 sm:col-span-2 grid grid-cols-2 mx-auto">
                                                <div className="col-span-1 ml-4 flex items-center">
                                                    <input className="appearance-none font-semibold text-gray-700 border rounded w-64 py-2 px-3 my-4 text-grey-400 mx-auto" onChange={e => setCategoriesEdit(categoriesEdit.map(c => { if (c._id === category._id) { return { ...c, name: e.target.value } } else return c }))} value={category?.name} type="text" />
                                                </div>
                                                <div className="col-span-1 flex items-center justify-end sm:justify-center">
                                                    <input className="shadow mr-4 sm:mr-0" onChange={e => setCategoriesEdit(categoriesEdit.map(c => { if (c._id === category._id) { return { ...c, color: e.target.value } } else return c }))} value={category?.color} name={"color_selector_" + category._id} type="color" />
                                                </div>
                                            </div>
                                            <div className="col-span-3 text-right sm:col-span-1">
                                                <div className="mx-auto flex items-center">
                                                    {
                                                        category.loading ?
                                                            <div className="my-4 text-gray-800 font-semibold px-6 py-2 mx-2 bg-gray-200  cursor-pointer">
                                                                <img src="/img/load.gif" alt="loading" className="w-6 h-6" />
                                                            </div> :
                                                            (categories?.filter(c => c._id == category._id)[0].name !== category.name || categories?.filter(c => c._id == category._id)[0].color !== category.color) ?
                                                                <button className="my-4 text-white font-semibold px-4 mx-2 py-2" style={{ backgroundColor: category.color }} type="submit">
                                                                    Salvar
                                                                </button> :
                                                                <div className="my-4 text-gray-800 font-semibold px-4 py-2 mx-2 bg-gray-200  cursor-pointer">
                                                                    Salvar
                                                                </div>
                                                    }
                                                    <div onClick={() => { $("body").css({ "overflow-y": "hidden" }); setIdToDelete(category?._id); setPopup("delete"); }} className="my-4 text-white font-semibold px-4 py-2 bg-red-600 hover:bg-red-700 mx-2 cursor-pointer">
                                                        Apagar
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    )
                                }) :
                                <div className="flex justify-center items-center h-64">
                                    <img src="/img/load.gif" alt="loading" className="w-12" />
                                </div>
                            }
                        </div>
                    </div>
                    <hr />
                    <Navigation callBack={page => LoadCategories({ page })} info={info} page={filters.page} pages={filters.pages} />
                </div>
            </LayoutAdminArea>
        </>
    )
}


export default Index