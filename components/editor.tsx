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
                buttonList: [...buttonList.complex]
            }} />
    );
};
export default MyComponent;