import React, { useState } from 'react'
import Api from '../../services/api'
import dynamic from 'next/dynamic'
import FormData from 'form-data'
import linkfy from '../../utils/linkfy'

const Editor = dynamic(
    () => import('../editor'),
    { ssr: false }
)
interface PostI {
    _id?: string,
    content?: any,
    title?: string,
    link?: string,
    description?: string,
    publishDate?: Date,
    category?: string,
    image?: string,
    author?: string
}

interface datas {
    info?: any,
    categories: { name: string, link: string }[],
    authors: { username: string, link: string }[],
    Post?: PostI,
    onSubmit: () => any,
    requestAs: "AdminArea" | "Admin"
}

export default function index({ Post, categories, authors, info, requestAs, onSubmit }: datas) {
    const [post, setPost] = useState<PostI>({
        ...Post,
        publishDate: Post?.publishDate ? new Date(Post?.publishDate) : new Date(),
        author: Post?.author || authors[0]?.username || "",
        category: Post?.category || categories[0]?.name || ""
    })
    const [editorTab, setEditorTab] = useState<number>(0)

    const [Content, setContent] = useState()

    const [loading, setLoading] = useState<boolean>(false)

    const [imageFile, setImageFile] = useState<{ preview: any; file: File }>({
        preview: post?.image || undefined,
        file: undefined
    })

    const handleChangeLink = (value) => {
        return linkfy(String(value))
    }

    let HandleAuthorChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        setPost({ ...post, author: e.target.value })
    }

    const HandleSubmitPost = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        let data = new FormData();

        data.append('image', imageFile?.file || Post.image || "");
        data.append('category', post?.category || "");
        data.append('content', Content || "");
        data.append('description', post?.description || "");
        data.append('link', post?.link || "");
        data.append('publishDate', String(post?.publishDate));
        data.append('title', post?.title || "");
        data.append('author', post?.author || "");
        data.append('requestAs', requestAs || "");
        if (post?._id)
            data.append('_id', post?._id);

        console.log(post)

        if (post?._id) {
            Api.put("/api/post", data, { withCredentials: true, headers: { 'content-type': 'multipart/form-data' } }).then(response => {
                setLoading(false)
                onSubmit()
            }).catch((e) => setLoading(false))
        } else {
            Api.post("/api/post", data, { withCredentials: true, headers: { 'content-type': 'multipart/form-data' } }).then(response => {
                setLoading(false)
                onSubmit()
            }).catch((e) => setLoading(false))
        }
    }

    return (
        <>
            <div>
                <form onSubmit={HandleSubmitPost}>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-3 lg:col-span-2 py-6">



                            <div className="my-4">
                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Tílulo:</span>
                                </div>
                                <div className="p-4 border shadow-md">
                                    <input value={post?.title} onChange={(e) => setPost({ ...post, title: String(e.target.value), link: handleChangeLink(String(e.target.value)) })} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="title" id="title" type="text" placeholder="Título" />
                                </div>
                            </div>



                            <div className="my-4">
                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Link:</span>
                                </div>
                                <div className="p-4 border shadow-md">
                                    <input value={post?.link} onChange={(e) => setPost({ ...post, link: handleChangeLink(String(e.target.value)) })} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="link" id="link" type="text" placeholder="link" />
                                </div>
                            </div>



                            <div>
                                <div className={`grid grid-cols-2 bg-${info?.colors?.background?.color}`}>
                                    <div className="col-span-1 text-center">
                                        <button type="button" onClick={() => setEditorTab(0)} className={(editorTab === 0 ? `bg-${info?.colors?.background?.shadow} ` : "") + `py-4 text-${info?.colors?.text?.color} font-semibold w-full`}>
                                            Editor
                                        </button>
                                    </div>
                                    <div className=" col-span-1 text-center post">
                                        <button type="button" onClick={() => setEditorTab(1)} className={(editorTab === 1 ? `bg-${info?.colors?.background?.shadow} ` : "") + `py-4 text-${info?.colors?.text?.color} font-semibold w-full`}>
                                            Pré-visualização
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <div className={(editorTab === 0 ? "hidden" : "") + " border shadow-lg p-4"} style={{ "maxHeight": "850px", "height": "100%", "overflow": "auto" }}>
                                        <div className="sun-editor-editable" dangerouslySetInnerHTML={{ __html: Content }}>

                                        </div>
                                    </div>
                                    <div className={(editorTab === 1 ? "hidden" : "")}>
                                        <Editor content={post?.content} setContent={c => setContent(c)} />
                                    </div>
                                </div>
                            </div>


                        </div>
                        <div className="col-span-3 lg:col-span-1 py-6">
                            <div className="my-4">
                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Descrição:</span>
                                </div>
                                <div className="p-4  border shadow-md">
                                    <textarea style={{ width: "100%" }} rows={5} defaultValue={post?.description} onChange={e => setPost({ ...post, description: e.target.value })} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="description" id="autoresizing" placeholder="Description"></textarea>
                                </div>
                            </div>
                            <div className="my-4">
                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Data de publicação:</span>
                                </div>
                                <div className="p-4  border shadow-md">
                                    <input onChange={e => setPost({ ...post, publishDate: e.target.valueAsDate })} value={(post?.publishDate ? new Date(post?.publishDate) : new Date()).toISOString().substr(0, 10)} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="publishDate" type="date" id="publishDate" placeholder="Publish Date" />
                                </div>
                            </div>
                            {requestAs === "AdminArea" ?
                                <div className="my-4">
                                    <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                        <span className={`font-semibold text-${info?.colors?.text?.color}`}>Autor:</span>
                                    </div>
                                    <div className="p-4  border shadow-md">
                                        <select name="author" onChange={HandleAuthorChange} defaultValue={post?.author} className={`text-sm w-32 text-gray-600 border border-gray-300 outline-none focus:outline-none p-1`}>
                                            {
                                                authors?.map(author => {
                                                    return <option key={author.username} className={`bg-white text-gray-700`} value={author.username || ""}>{author.username || ""}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                </div> : ""
                            }
                            <div className="my-4">
                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Categoria:</span>
                                </div>
                                <div className="p-4 border shadow-md">
                                    <div className="pb-5">
                                        {categories?.map((c, i) => {
                                            return (
                                                <label key={i} className="inline-flex mx-3 items-center mt-3">
                                                    <input type="radio" id="category" name="category" onChange={e => setPost({ ...post, category: c.name })} value={c.name} className="form-checkbox h-5 w-5 text-gray-600" checked={c?.name === post?.category} /><span className="ml-1 text-gray-700">{c.name}</span>
                                                </label>
                                            )
                                        })
                                        }
                                    </div>

                                </div>
                            </div>

                            <div className="my-4 shadow-md">
                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Banner:</span>
                                </div>
                                <div className="p-4">
                                    <label aria-label="Banner">
                                        <input className="hidden" onChange={e => setImageFile({ preview: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : undefined, file: e.target.files[0] })} type="file" id="file" name="icon" accept="image/x-png,image/jpeg,image/webp" />
                                        <div className="pb-4">
                                            <span className={`bg-${info?.colors?.background?.color} mt-4 hover:bg-${info?.colors?.background?.shadow} rounded px-4 py-2 text-${info?.colors?.text?.shadow} hover:text-${info?.colors?.text?.color} font-semibold`}>Escolher Banner</span>
                                        </div>

                                        <div style={{ maxWidth: "25em" }} className={`w-full h-44 p-4 bg-${info?.colors?.background?.color} shadow-lg border border-${info?.colors?.background?.shadow}`}>
                                            {imageFile.preview ?
                                                <img id="icon-img" alt="icon" src={imageFile?.preview} className={`mx-auto shadow-lg h-full`} />
                                                :
                                                <div>

                                                </div>
                                            }
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-3 text-center">
                            <hr />
                            {
                                loading ?
                                    <img src="/img/load.gif" alt="loading" className="w-12 mx-auto py-4" /> :
                                    <input type="submit" className={`my-6 bg-${info?.colors?.background?.color} hover:bg-${info?.colors?.background?.color} text-${info?.colors?.text?.color} hover:text-${info?.colors?.text?.shadow} px-6 py-2 font-semibold`} value={post?._id ? "Atualizar post" : "Criar post"} />
                            }
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}