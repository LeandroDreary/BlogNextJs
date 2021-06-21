import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { Outclick } from '..'
import FormData from 'form-data'
import $ from 'jquery'
import { PagesInfoI, WarningI } from '../../utils/types'

const Index = ({ Info, infoInputs, setInfoInputs }) => {
    const [info, setInfo] = useState<PagesInfoI>(Info)

    const [changed, setChanged] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [warnings, setWarnings] = useState<WarningI[]>([])

    // Image inputs
    const [iconFile, setIconFile] = useState<{ preview: any; file: File }>({
        preview: info?.icon || undefined,
        file: undefined
    })
    const [iconICONFile, setIconICONFile] = useState<{ preview: any; file: File }>({
        preview: undefined,
        file: undefined
    })


    //  Popups state
    const [popup, setPopup] = useState<"textColor" | "textShadow" | "backgroundColor" | "backgroundShadow" | "">("")

    let colors = ["green", "blue", "indigo", "purple", "pink", "red", "yellow", "gray"]
    let intonations = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"]

    useEffect(() => {
        if (infoInputs?.colors !== info?.colors ||
            infoInputs?.customLayout !== info?.customLayout ||
            infoInputs?.customLayoutStyles !== info?.customLayoutStyles ||
            infoInputs?.description !== info?.description ||
            infoInputs?.icon !== info?.icon ||
            infoInputs?.keywords !== info?.keywords ||
            infoInputs?.websiteName !== info?.websiteName)
            setChanged(true)

    }, [info, infoInputs]);

    useEffect(() => {
        let customLayoutStyles = `<style>
    .border-custom{
        border-color:${infoInputs?.customLayout?.colors?.text?.color};
    }
    .border-custom2{
        border-color:${infoInputs?.customLayout?.colors?.text?.shadow};
    }
    .bg-custom{
        background-color:${infoInputs?.customLayout?.colors?.background?.color};
    }
    .hover${'\\'}:bg-custom:hover{
        background-color:${infoInputs?.customLayout?.colors?.background?.color};
    }
    .bg-custom2{
        background-color:${infoInputs?.customLayout?.colors?.background?.shadow};
    }
    .hover${'\\'}:bg-custom2:hover{
        background-color:${infoInputs?.customLayout?.colors?.background?.shadow};
    }
    .text-custom{
        color:${infoInputs?.customLayout?.colors?.text?.color};
    }
    .hover${'\\'}:text-custom:hover{
        color:${infoInputs?.customLayout?.colors?.text?.color};
    }
    .text-custom2{
        color:${infoInputs?.customLayout?.colors?.text?.shadow};
    }
    .hover${'\\'}:text-custom2:hover{
        color:${infoInputs?.customLayout?.colors?.text?.shadow};
    }
    .placeholder-custom::placeholder{
        color:${infoInputs?.customLayout?.colors?.text?.color};
    }
    .placeholder-custom2::placeholder{
        color:${infoInputs?.customLayout?.colors?.text?.shadow};
    }
</style>`;
        setInfoInputs({ ...infoInputs, customLayoutStyles })
    }, [infoInputs?.customLayout])


    const HandleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        let data = new FormData();

        data.append('icon', iconFile?.file || infoInputs?.icon || "");
        data.append('iconICO', iconICONFile?.file || "");
        data.append('colors', JSON.stringify(infoInputs?.colors));
        data.append('description', infoInputs?.description);
        data.append('keywords', infoInputs?.keywords);
        data.append('websiteName', infoInputs?.websiteName);
        data.append('customLayout', JSON.stringify(infoInputs?.customLayout));
        data.append('customLayoutStyles', infoInputs?.customLayoutStyles);
        data.append('name', "info");

        api.post('/api/config', data, { withCredentials: true, headers: { 'content-type': 'multipart/form-data' } }).then(res => {
            setInfo({ ...infoInputs, ...res.data?.result })
            setInfoInputs({ ...infoInputs, ...res.data?.result })
            setChanged(false)
            setLoading(false)
        }).catch(e => setLoading(false))
    }


    return (
        <>
            {popup !== "" ?
                <div className="top-0 left-0 fixed h-full w-full bg-black bg-opacity-50 flex justify-center items-center z-20">
                    <Outclick callback={() => { $("body").css({ "overflow-y": "auto" }); setPopup(""); }}>
                        <div className="slide-up bg-white rounded px-12 py-4 z-20">
                            {
                                {
                                    "backgroundColor": <>
                                        <label htmlFor="shadow" className="font-semibold text-gray-700 py-4">Cor de fundo 1: </label><br />
                                        {
                                            colors.map(color => {
                                                return (
                                                    <div className="py-1" key={`${color}-BoxColor`}>
                                                        {
                                                            intonations.map(intonation => {
                                                                return (
                                                                    <div key={`${color}-${intonation}-BoxColor`} className="inline-flex">
                                                                        <input type="radio" id={`${color}-${intonation}-BoxColor`} name="boxColor" className={`background-radio bg-${color}-${intonation}`} />
                                                                        <label onClick={(e) => setInfoInputs({ ...infoInputs, colors: { ...infoInputs?.colors, background: { ...infoInputs?.colors?.background, color: `${color}-${intonation}` } } })} className={`bg-${color}-${intonation}`} htmlFor={`${color}-${intonation}-BoxColor`}></label>
                                                                    </div>
                                                                )
                                                            })}
                                                    </div>
                                                )
                                            })
                                        }
                                        <label htmlFor="shadow" className="font-semibold text-gray-700 py-4">Customizado: </label><br />
                                        <div className="py-1">
                                            <div className="inline-flex">
                                                <input type="radio" id={`custom-BoxColor`} name="boxColor" className={`background-radio bg-custom`} />
                                                <label onClick={(e) => setInfoInputs({ ...infoInputs, colors: { ...infoInputs?.colors, background: { ...infoInputs?.colors?.background, color: `custom` } } })} className={`bg-custom ring-1 px-1 m-1`} htmlFor={`custom-BoxColor`}></label>
                                            </div>
                                            <div className="col-span-1 flex items-center justify-end sm:justify-center">
                                                <input defaultValue={infoInputs?.customLayout?.colors?.background?.color} onChange={e => setInfoInputs({ ...infoInputs, customLayout: { ...infoInputs?.customLayout, colors: { ...infoInputs?.customLayout?.colors, background: { ...infoInputs?.customLayout?.colors?.background, color: e.target.value } } } })} className="mr-4 sm:mr-0" name={"color_selector_bg_custom"} type="color" />
                                            </div>
                                        </div>
                                    </>,


                                    "backgroundShadow": <>
                                        <label htmlFor="shadow" className="font-semibold text-gray-700 py-4">Cor de fundo 2: </label><br />
                                        {
                                            colors.map(color => {

                                                return (
                                                    <div className="py-1" key={`${color}-ShadowBoxColor`}>
                                                        {
                                                            intonations.map(intonation => {
                                                                return (
                                                                    <div key={`${color}-${intonation}-ShadowBoxColor`} className="inline-flex">
                                                                        <input type="radio" id={`${color}-${intonation}-ShadowBoxColor`} name="ShadowBoxColor" className={`background-radio bg-${color}-${intonation}`} />
                                                                        <label onClick={(e) => setInfoInputs({ ...infoInputs, colors: { ...infoInputs?.colors, background: { ...infoInputs?.colors?.background, shadow: `${color}-${intonation}` } } })} className={`bg-${color}-${intonation}`} htmlFor={`${color}-${intonation}-ShadowBoxColor`}></label>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                        <label htmlFor="shadow" className="font-semibold text-gray-700 py-4">Customizado: </label><br />
                                        <div className="py-1">
                                            <div className="inline-flex">
                                                <input type="radio" id={`custom2-ShadowBoxColor`} name="ShadowBoxColor" className={`background-radio bg-custom2`} />
                                                <label onClick={(e) => setInfoInputs({ ...infoInputs, colors: { ...infoInputs?.colors, background: { ...infoInputs?.colors?.background, shadow: `custom2` } } })} className={`bg-custom2 ring-1 px-1 m-1`} htmlFor={`custom2-ShadowBoxColor`}></label>
                                            </div>
                                            <div className="col-span-1 flex items-center justify-end sm:justify-center">
                                                <input defaultValue={infoInputs?.customLayout?.colors?.background?.shadow} onChange={e => setInfoInputs({ ...infoInputs, customLayout: { ...infoInputs?.customLayout, colors: { ...infoInputs?.customLayout?.colors, background: { ...infoInputs?.customLayout?.colors?.background, shadow: e.target.value } } } })} className="mr-4 sm:mr-0" name={"color_selector_bg_custom2"} type="color" />
                                            </div>
                                        </div>
                                    </>,


                                    "textColor": <>
                                        <label htmlFor="shadow" className="font-semibold text-gray-700 py-4">Cor de texto 1: </label><br />
                                        {
                                            colors.map(color => {

                                                return (
                                                    <div className="py-1" key={`${color}-textColor`}>
                                                        {
                                                            intonations.map(intonation => {
                                                                return (
                                                                    <div key={`${color}-${intonation}-textColor`} className="inline-flex">
                                                                        <input type="radio" id={`${color}-${intonation}-textColor`} name="textColor" className={`text-radio text-${color}-${intonation}`} />
                                                                        <label onClick={(e) => setInfoInputs({ ...infoInputs, colors: { ...infoInputs?.colors, text: { ...infoInputs?.colors?.text, color: `${color}-${intonation}` } } })} className={`text-${color}-${intonation}`} htmlFor={`${color}-${intonation}-textColor`}>Aa</label>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                        <label htmlFor="shadow" className="font-semibold text-gray-700 py-4">Customizado: </label><br />
                                        <div className="py-1">
                                            <div className="inline-flex">
                                                <input type="radio" id={`custom-textColor`} name="textColor" className={`text-radio text-custom`} />
                                                <label onClick={(e) => setInfoInputs({ ...infoInputs, colors: { ...infoInputs?.colors, text: { ...infoInputs?.colors?.text, color: `custom` } } })} className={`text-custom ring-1 px-1 m-1`} htmlFor={`custom-textColor`}>Aa</label>
                                            </div>
                                            <div className="col-span-1 flex items-center justify-end sm:justify-center">
                                                <input defaultValue={infoInputs?.customLayout?.colors?.text?.color} onChange={e => setInfoInputs({ ...infoInputs, customLayout: { ...infoInputs?.customLayout, colors: { ...infoInputs?.customLayout?.colors, text: { ...infoInputs?.customLayout?.colors?.background, color: e.target.value } } } })} className="mr-4 sm:mr-0" name={"color_selector_text_custom"} type="color" />
                                            </div>
                                        </div>
                                    </>,


                                    "textShadow": <>
                                        <label htmlFor="shadow" className="font-semibold text-gray-700 py-4">Cor de texto 2: </label><br />
                                        {
                                            colors.map(color => {

                                                return (
                                                    <div className="py-1" key={`${color}-ShadowTextColor`}>
                                                        {
                                                            intonations.map(intonation => {
                                                                return (
                                                                    <div key={`${color}-${intonation}-ShadowTextColor`} className="inline-flex">
                                                                        <input type="radio" id={`${color}-${intonation}-ShadowTextColor`} name="ShadowTextColor" className={`text-radio text-${color}-${intonation}`} />
                                                                        <label onClick={(e) => setInfoInputs({ ...infoInputs, colors: { ...infoInputs?.colors, text: { ...infoInputs?.colors?.text, shadow: `${color}-${intonation}` } } })} className={`text-${color}-${intonation}`} htmlFor={`${color}-${intonation}-ShadowTextColor`}>Aa</label>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                        <label htmlFor="shadow" className="font-semibold text-gray-700 py-4">Customizado: </label><br />
                                        <div className="py-1">
                                            <div className="inline-flex">
                                                <input type="radio" id={`custom2-ShadowTextColor`} name="ShadowTextColor" className={`text-radio text-custom2`} />
                                                <label onClick={(e) => setInfoInputs({ ...infoInputs, colors: { ...infoInputs?.colors, text: { ...infoInputs?.colors?.text, shadow: `custom2` } } })} className={`text-custom2 ring-1 px-1 m-1`} htmlFor={`custom2-ShadowTextColor`}>Aa</label>
                                            </div>
                                            <div className="col-span-1 flex items-center justify-end sm:justify-center">
                                                <input defaultValue={infoInputs?.customLayout?.colors?.text?.shadow} onChange={e => setInfoInputs({ ...infoInputs, customLayout: { ...infoInputs?.customLayout, colors: { ...infoInputs?.customLayout?.colors, text: { ...infoInputs?.customLayout?.colors?.text, shadow: e.target.value } } } })} className="mr-4 sm:mr-0" name={"color_selector_text_custom2"} type="color" />
                                            </div>
                                        </div>
                                    </>
                                }[popup]
                            }
                        </div>
                    </Outclick>
                </div> : ""
            }


            <form onSubmit={HandleFormSubmit}>
                <div className="grid grid-cols-3 border shadow-md bg-white text-center md:text-left">
                    <div className={"col-span-3 bg-" + (infoInputs?.colors?.background?.shadow || "gray-500")}>
                        <h2 className={`font-semibold text-2xl my-2 mx-4 text-${infoInputs?.colors?.text?.color || "white"}`}>Informações:</h2>
                    </div>
                    <div className="col-span-3 md:col-span-1 pt-4 pb-4 px-4">
                        <div className="py-1">
                            <label htmlFor="websiteName" className="font-semibold text-gray-700">Nome do site: </label><br />
                            <input value={infoInputs?.websiteName} onChange={e => setInfoInputs({ ...infoInputs, websiteName: e.target.value })} className="shadow w-64 appearance-none border max-w-full rounded py-1 px-3 text-gray-600" type="text" name="websiteName" />
                            {
                                warnings.map(warning => {
                                    if (warning.input === "websiteName")
                                        switch (warning.type) {
                                            case 'error':
                                                return <p key={warning.message} className="w-full text-center border border-red-400 py-3 bg-red-50 text-red-400 text-xs italic font-bold my-2">{warning.message}</p>
                                            case 'success':
                                                return <p key={warning.message} className="w-full text-center border border-green-400 py-3 bg-green-50 text-green-400 text-xs italic font-bold my-2">{warning.message}</p>
                                            case 'warnings':
                                                return <p key={warning.message} className="w-full text-center border border-yellow-400 py-3 bg-yellow-50 text-yellow-400 text-xs italic font-bold my-2">{warning.message}</p>
                                        }
                                })
                            }
                        </div>
                        <div className="py-1 pt-5 md:pt-0">
                            <label htmlFor="description" className="font-semibold text-gray-700">Descrição: </label><br />
                            <textarea value={infoInputs?.description} onChange={e => setInfoInputs({ ...infoInputs, description: e.target.value })} className="shadow w-64 appearance-none border max-w-full rounded py-1 px-3 text-gray-600" name="description"></textarea>
                            {
                                warnings.map(warning => {
                                    if (warning.input === "description")
                                        switch (warning.type) {
                                            case 'error':
                                                return <p key={warning.message} className="w-full text-center border border-red-400 py-3 bg-red-50 text-red-400 text-xs italic font-bold my-2">{warning.message}</p>
                                            case 'success':
                                                return <p key={warning.message} className="w-full text-center border border-green-400 py-3 bg-green-50 text-green-400 text-xs italic font-bold my-2">{warning.message}</p>
                                            case 'warnings':
                                                return <p key={warning.message} className="w-full text-center border border-yellow-400 py-3 bg-yellow-50 text-yellow-400 text-xs italic font-bold my-2">{warning.message}</p>
                                        }
                                })
                            }
                        </div>
                        <div className="py-1 pt-5 md:pt-0">
                            <label htmlFor="keywords" className="font-semibold text-gray-700">Palavras chaves: </label><br />
                            <textarea value={infoInputs?.keywords} onChange={e => setInfoInputs({ ...infoInputs, keywords: e.target.value })} className="shadow w-64 appearance-none border max-w-full rounded py-1 px-3 text-gray-600" name="keywords"></textarea>
                            {
                                warnings.map(warning => {
                                    if (warning.input === "keywords")
                                        switch (warning.type) {
                                            case 'error':
                                                return <p key={warning.message} className="w-full text-center border border-red-400 py-3 bg-red-50 text-red-400 text-xs italic font-bold my-2">{warning.message}</p>
                                            case 'success':
                                                return <p key={warning.message} className="w-full text-center border border-green-400 py-3 bg-green-50 text-green-400 text-xs italic font-bold my-2">{warning.message}</p>
                                            case 'warnings':
                                                return <p key={warning.message} className="w-full text-center border border-yellow-400 py-3 bg-yellow-50 text-yellow-400 text-xs italic font-bold my-2">{warning.message}</p>
                                        }
                                })
                            }
                        </div>
                    </div>
                    <div className="col-span-3 md:col-span-1 pt-4 pb-4 px-4">
                        <span className="font-semibold text-gray-700 py-1">Ícone: </span>
                        <div className="py-3">
                            <label aria-label="icon">
                                <input className="hidden" onChange={e => { setIconFile({ file: e.target.files[0], preview: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : undefined }); setChanged(true); setInfoInputs({ ...infoInputs, icon: "" }) }} type="file" id="file" name="icon" accept="image/x-png,image/jpeg,image/webp" />
                                <div className="pb-4">
                                    <span className={`bg-${infoInputs?.colors?.background?.color} mt-4 hover:bg-${infoInputs?.colors?.background?.shadow} rounded px-4 py-2 text-${infoInputs?.colors?.text?.shadow} hover:text-${infoInputs?.colors?.text?.color} text-custom2-h font-semibold`}>Escolher Ícone</span>
                                </div>
                            </label>
                            <div style={{ maxWidth: "17em" }} className={`w-full mx-auto md:ml-0 h-36 p-4 bg-${infoInputs?.colors?.background?.color} shadow-lg border border-${infoInputs?.colors?.background?.shadow}`}>
                                {iconFile.preview ?
                                    <img id="icon-img" alt="icon" src={iconFile?.preview} className={`mx-auto shadow-lg h-full`} />
                                    :
                                    <div>

                                    </div>
                                }
                            </div>
                        </div>
                        {
                            warnings.map(warning => {
                                if (warning.input === "icon")
                                    switch (warning.type) {
                                        case 'error':
                                            return <p key={warning.message} className="w-full text-center border border-red-400 py-3 bg-red-50 text-red-400 text-xs italic font-bold my-2">{warning.message}</p>
                                        case 'success':
                                            return <p key={warning.message} className="w-full text-center border border-green-400 py-3 bg-green-50 text-green-400 text-xs italic font-bold my-2">{warning.message}</p>
                                        case 'warnings':
                                            return <p key={warning.message} className="w-full text-center border border-yellow-400 py-3 bg-yellow-50 text-yellow-400 text-xs italic font-bold my-2">{warning.message}</p>
                                    }
                            })
                        }
                        <span className="font-semibold text-gray-700 py-1">Ícone ICO: </span>
                        <div className="py-3">
                            <label aria-label="icon">
                                <input className="hidden" onChange={e => { setIconICONFile({ file: e.target.files[0], preview: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : undefined }); setChanged(true) }} type="file" id="file" name="icon" accept="image/x-icon" />
                                <div className="pb-4">
                                    <span className={`bg-${infoInputs?.colors?.background?.color} mt-4 hover:bg-${infoInputs?.colors?.background?.shadow} rounded px-4 py-2 text-${infoInputs?.colors?.text?.shadow} hover:text-${infoInputs?.colors?.text?.color} text-custom2-h font-semibold`}>Escolher Ícone</span>
                                </div>
                            </label>
                            <div style={{ maxWidth: "17em" }} className={`w-full mx-auto md:ml-0 h-36 p-4 bg-${infoInputs?.colors?.background?.color} shadow-lg border border-${infoInputs?.colors?.background?.shadow}`}>
                                <img id="icon-img" alt="icon" src={iconICONFile?.preview || "/favicon.ico"} className={`mx-auto shadow-lg h-full`} />

                            </div>
                        </div>
                    </div>
                    <div className="col-span-3 md:col-span-1 pt-4 pb-4 px-4">
                        <div className="py-1">
                            <label htmlFor="websiteName" className="font-semibold text-gray-700">Cor de fundo 1: </label><br />
                            <div className="flex items-center justify-center md:justify-start">
                                <button onClick={() => { setPopup("backgroundColor"); $("body").css({ "overflow-y": "hidden" }) }} type="button" className={`px-4 py-2 bg-${infoInputs?.colors?.background?.color || "gray-500"} hover:bg-${infoInputs?.colors?.background?.shadow} inline-flex text-${infoInputs?.colors?.text?.color || "white"} hover:text-${infoInputs?.colors?.text?.shadow || "gray-100"} my-2 font-semibold`}>Select Color</button><div className={"w-8 h-8 m-2 bg-" + (infoInputs?.colors?.background?.color || "gray-500")}></div>
                            </div>
                        </div>
                        <div className="py-1 pt-5 md:pt-0">
                            <label htmlFor="websiteName" className="font-semibold text-gray-700">Cor de fundo 2: </label><br />
                            <div className="flex items-center justify-center md:justify-start">
                                <button onClick={() => { setPopup("backgroundShadow"); $("body").css({ "overflow-y": "hidden" }) }} type="button" className={`px-4 py-2 bg-${infoInputs?.colors?.background?.color || "gray-500"} hover:bg-${infoInputs?.colors?.background?.shadow} inline-flex text-${infoInputs?.colors?.text?.color || "white"} hover:text-${infoInputs?.colors?.text?.shadow || "gray-100"} my-2 font-semibold`}>Select Color</button><div className={"w-8 h-8 m-2 bg-" + (infoInputs?.colors?.background?.shadow)}></div>
                            </div>
                        </div>
                        <div className="py-1 pt-5 md:pt-0">
                            <label htmlFor="websiteName" className="font-semibold text-gray-700">Cor de texto 1: </label><br />
                            <div className="flex items-center justify-center md:justify-start">
                                <button onClick={() => { setPopup("textColor"); $("body").css({ "overflow-y": "hidden" }) }} type="button" className={`px-4 py-2 bg-${infoInputs?.colors?.background?.color || "gray-500"} hover:bg-${infoInputs?.colors?.background?.shadow} inline-flex text-${infoInputs?.colors?.text?.color || "white"} hover:text-${infoInputs?.colors?.text?.shadow || "gray-100"} my-2 font-semibold`}>Select Color</button><div className={"text-2xl m-2 text-" + (infoInputs?.colors?.text?.color || "gray-500")}>Aa</div>
                            </div>
                        </div>
                        <div className="py-1 pt-5 md:pt-0">
                            <label htmlFor="websiteName" className="font-semibold text-gray-700">Cor de texto 2: </label><br />
                            <div className="flex items-center justify-center md:justify-start">
                                <button onClick={() => { setPopup("textShadow"); $("body").css({ "overflow-y": "hidden" }) }} type="button" className={`px-4 py-2 bg-${infoInputs?.colors?.background?.color || "gray-500"} hover:bg-${infoInputs?.colors?.background?.shadow} inline-flex text-${infoInputs?.colors?.text?.color || "white"} hover:text-${infoInputs?.colors?.text?.shadow || "gray-100"} my-2 font-semibold`}>Select Color</button><div className={"text-2xl m-2 text-" + (infoInputs?.colors?.text?.shadow || "gray-700")}>Aa</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-3 mb-4 mt-2 text-center">
                        <hr className="mx-4" />
                        {
                            loading ?
                                <img src="/img/load.gif" className="h-12 mx-auto my-3" alt="carregando" /> :
                                changed ?
                                    <button className={`bg-${infoInputs?.colors?.background?.color} mt-4 hover:bg-${infoInputs?.colors?.background?.shadow} rounded px-4 py-2 text-${infoInputs?.colors?.text?.shadow} hover:text-${infoInputs?.colors?.text?.color} text-custom2-h font-semibold`} type="submit">Salvar</button>
                                    :
                                    <button className="bg-gray-100 mt-4 hover:bg-gray-200 rounded px-4 py-2 text-gray-900 font-semibold" type="button">Salvar</button>
                        }
                    </div>
                </div>
            </form>
        </>
    )

}

export default Index