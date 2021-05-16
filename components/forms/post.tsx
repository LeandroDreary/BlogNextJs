import Head from 'next/head'
import { useState, useEffect } from 'react'
import $ from 'jquery'
import Api from './../../services/api'
import UploadImage from './../../services/uploadImage'
import Router from 'next/router'

interface PostI {
    _id?: string,
    content?: string,
    title?: string,
    link?: string,
    description?: string,
    publishDate?: Date,
    category?: string,
    image?: string,
    info?: any
}

export default function index({ _id, content, title, link, description, publishDate, category, image, info }: PostI) {
    const [post, setPost] = _id ? useState<PostI>({ _id, content, title, link, description, publishDate, category, image }) : useState<PostI>();
    const [editorTab, setEditorTab] = useState<number>(0)
    const [imageFile, setImageFile] = useState<{ preview: any; file: File }>({
        preview: post?.image || undefined,
        file: undefined
    })

    const [categories, setCategories] = useState<{ name: string, color: string }[]>([{ color: "", name: "" }])

    const LoadCategories = () => {
        Api.get('/api/category/list', { withCredentials: true }).then(response => {
            setCategories(response.data?.result?.map(c => { return { name: c.name, color: c.color } }))
        })
    }


    useEffect(() => {
        LoadCategories()

        var now = new Date(publishDate) || new Date()
        setPost({ ...post, publishDate: now })


        const loadSummernote = () => {
            const script = document.createElement('script');

            $("#code-preview").html(post?.content);

            script.innerHTML = `$("document").ready(() => {
        $("#summernote").summernote({
            tabDisable: false,
            styleTags: [
                {
                    tag : 'p',
                    title : 'paragraph',
                    className : 'text-gray-800 text-justify pb-2',
                    value : 'p'
               },
                {
                    tag : 'h2',
                    title : 'Title',
                    className : 'text-2xl pt-4 pb-2 text-gray-900',
                    value : 'h2'
               },
                {
                    tag : 'h3',
                    title : 'Subtitle',
                    className : 'text-xl pt-4 pb-2 text-gray-800',
                    value : 'h3'
               }
            ],
            callbacks: {
              onChange: function (contents, $editable) {
                $("#code-preview").html(contents)
              }
            },
            maxHeight: 800,
          }); 
          $('#summernote').summernote('code', $("#code-preview").html())
        })`;
            script.async = true;

            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            }
        }
        setTimeout(loadSummernote, 250)
    }, [process.browser]);

    const HandleSubmitPost = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const save = (image: string) => {
            if (_id) {
                Api.put("/api/post", { ...post, image, content: $("#code-preview").html() }, { withCredentials: true }).then(response => {
                    Router.push('/admin/post')
                })
            } else {
                Api.post("/api/post", { ...post, image, content: $("#code-preview").html() }, { withCredentials: true }).then(response => {
                    Router.push('/admin/post')
                })
            }
        }
        if (imageFile.file) {
            save((await UploadImage(imageFile.file)).secure_url)
        } else {
            save(post?.image)
        }
    }

    const handleChangeLink = (e: any) => {
        let value: string = e.target.value;
        value = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        value = value.toLowerCase();
        value = value.split(' ').join('-');
        value = value.split(':').join('-');
        value = value.split('?').join('-');
        value = value.split('/').join('-');
        while (value.includes('--')) {
            value = value.split('--').join('-');
        }
        e.target.value = value;
        setPost({ ...post, link: e.target.value })
    }


    return (
        <>
            <Head>
                <link rel="stylesheet" href="/css/post.css" />
                <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.js"></script>
                <link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote-lite.min.css" rel="stylesheet" />
            </Head>
            <div>
                <form onSubmit={HandleSubmitPost}>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-3 lg:col-span-2 py-6">


                            <div className="my-4">
                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Title</span>
                                </div>
                                <div className="p-4 border shadow-md">
                                    <input defaultValue={title} onChange={e => { $('[name=link]').val(e.target.value); $('[name=link]').trigger("click"); setPost({ ...post, title: String(e.target.value) }); }} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="title" id="title" type="text" placeholder="title" />
                                    <div>
                                        {post?.title?.length < 10 || post?.title?.length > 60 ?
                                            <>
                                                <span className="text-sm text-yellow-500">We recommend a title with more than 10 chacteres and less than 60.</span><br />
                                            </>
                                            : ""}
                                    </div>
                                </div>
                            </div>



                            <div className="my-4">
                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Link</span>
                                </div>
                                <div className="p-4 border shadow-md">
                                    <input defaultValue={link} onChange={handleChangeLink} onClick={handleChangeLink} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="link" id="link" type="text" placeholder="link" />
                                </div>
                            </div>



                            <div>
                                <div className={`grid grid-cols-2 bg-${info?.colors?.background?.color}`}>
                                    <div className="col-span-1 text-center">
                                        <button type="button" onClick={() => setEditorTab(0)} className={(editorTab === 0 ? `bg-${info?.colors?.background?.shadow} ` : "") + `py-4 text-${info?.colors?.text?.color} font-semibold w-full`}>
                                            Editor
                                </button>
                                    </div>
                                    <div className="col-span-1 text-center post">
                                        <button type="button" onClick={() => setEditorTab(1)} className={(editorTab === 1 ? `bg-${info?.colors?.background?.shadow} ` : "") + `py-4 text-${info?.colors?.text?.color} font-semibold w-full`}>
                                            Preview
                                </button>
                                    </div>
                                </div>
                                <div>
                                    <div className={(editorTab === 0 ? "hidden" : "") + " border shadow-lg p-4"} style={{ "maxHeight": "850px", "height": "100%", "overflow": "auto" }} id="code-preview">
                                    </div>
                                    <div className={(editorTab === 1 ? "hidden" : "")}>
                                        <div id="summernote">

                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                        <div className="col-span-3 lg:col-span-1 py-6">
                            <div className="my-4">
                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Description</span>
                                </div>
                                <div className="p-4  border shadow-md">
                                    <textarea style={{ width: "100%" }} defaultValue={description} onChange={e => setPost({ ...post, description: e.target.value })} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="description" id="autoresizing" placeholder="Description"></textarea>
                                    <div>
                                        {post?.description?.length < 100 || post?.description?.length > 320 ?
                                            <>
                                                <span className="text-sm text-yellow-500">We recommend a description with more than 100 chacteres and less than 320.</span><br />
                                            </>
                                            : ""}
                                    </div>
                                </div>
                            </div>
                            <div className="my-4">
                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Publish Date</span>
                                </div>
                                <div className="p-4  border shadow-md">
                                    <input onChange={e => setPost({ ...post, publishDate: new Date(e.target.value) })} value={(publishDate ? (new Date(post?.publishDate)) : new Date()).toISOString().substr(0, 10)} className="shadow w-full appearance-none border border-red rounded py-2 px-3 text-grey-400 mb-3" name="publishDate" type="date" id="publishDate" placeholder="Publish Date" />
                                </div>
                            </div>
                            <div className="my-4">
                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Category</span>
                                </div>
                                <div className="p-4 border shadow-md">
                                    <div className="pb-5">
                                        {categories?.map((c, i) => {
                                            return (
                                                <label key={i} className="inline-flex mx-3 items-center mt-3">
                                                    <input type="radio" id="category" name="category" onChange={e => setPost({ ...post, category: e.target.value })} value={c.name} className="form-checkbox h-5 w-5 text-gray-600" checked={c?.name === post?.category} /><span style={{ color: c.color }} className="ml-1 text-gray-700">{c.name}</span>
                                                </label>
                                            )
                                        })
                                        }
                                    </div>

                                </div>
                            </div>

                            <div className="my-4 shadow-md">
                                <div className={`bg-${info?.colors?.background?.color} p-2 px-4`}>
                                    <span className={`font-semibold text-${info?.colors?.text?.color}`}>Image</span>
                                </div>
                                <div className="p-4">
                                    <label aria-label="Banner">
                                        <input className="hidden" onChange={e => setImageFile({ preview: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : undefined, file: e.target.files[0] })} type="file" id="file" name="icon" accept="image/x-png,image/jpeg" />
                                        <div className="pb-4">
                                            <span className={`bg-${info?.colors?.background?.color} mt-4 hover:bg-${info?.colors?.background?.shadow} rounded px-4 py-2 text-${info?.colors?.text?.shadow} hover:text-${info?.colors?.text?.color} font-semibold`}>Choose Banner</span>
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
                            <input type="submit" className={`my-6 bg-${info?.colors?.background?.color} hover:bg-${info?.colors?.background?.color} text-${info?.colors?.text?.color} hover:text-${info?.colors?.text?.shadow} px-6 py-2 font-semibold`} value={_id ? "Update Post" : "Create Post"} />
                        </div>
                    </div>
                </form>
            </div>

            <script src="/javascript/summernote/summernote.js"></script>
        </>
    )
}