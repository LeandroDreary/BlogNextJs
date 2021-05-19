// Typescript Version
import React from "react";
import SunEditor, { buttonList } from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

const MyComponent = ({ content, setContent }: { content: any, setContent: any }) => {

    return (
        <SunEditor lang="pt_br"
            setDefaultStyle="font-family: Arial; font-size: 16px;"

            setContents={content}
            onChange={setContent}
            setOptions={{
                lang: undefined,
                buttonList: [...buttonList.complex],
                formats: [
                    {
                        tag: 'p',
                        name: 'Parágrafo' || null,
                        command: 'replace' || 'range' || 'free',
                        class: 'py-1 text-gray-700'
                    },
                    {
                        tag: 'h2',
                        name: 'Título' || null,
                        command: 'replace' || 'range' || 'free',
                        class: 'text-xl font-semibold text-gray-700'
                    },
                ]
            }} />
    );
};
export default MyComponent;