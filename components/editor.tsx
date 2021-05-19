// Typescript Version
import React from "react";
import SunEditor, { buttonList } from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import "tailwindcss/tailwind.css"
import $ from "jquery";

const MyComponent = ({ content, setContent }: { content: any, setContent: any }) => {

    const onLoad = () => {
        $(".sun-editor-editable").removeClass("sun-editor-editable").addClass("m-4")
    }

    return (
        <SunEditor lang="pt_br"
            setDefaultStyle="font-family: Arial;"
            onLoad={onLoad}
            setContents={content}
            onChange={setContent}
            setOptions={{
                lang: undefined,
                buttonList: [
                    ['undo', 'redo'],
                    ['font', 'fontSize', 'formatBlock'],
                    ['paragraphStyle', 'blockquote',
                        'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript',
                        'fontColor', 'hiliteColor', 'textStyle'],
                    ['removeFormat',
                        'outdent', 'indent',
                        'align', 'horizontalRule', 'lineHeight'], ['list',
                        'table'], ['link', 'image', 'video', 'audio'],
                    ['fullScreen', 'showBlocks', 'codeView',
                        'preview']],
                defaultTag: "p",
                formats: [
                    {
                        tag: 'p',
                        name: 'Parágrafo' || null,
                        command: 'replace' || 'range' || 'free',
                        class: 'my-2 text-gray-700'
                    },
                    {
                        tag: 'h2',
                        name: 'Título' || null,
                        command: 'replace' || 'range' || 'free',
                        class: 'my-2 text-2xl text-gray-700 font-extrabold'
                    },
                    {
                        tag: 'h3',
                        name: 'Sub Título' || null,
                        command: 'replace' || 'range' || 'free',
                        class: 'my-2 text-xl text-gray-700 font-semibold'
                    },
                ]
            }} />
    );
};
export default MyComponent;