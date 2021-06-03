// Typescript Version
import React from "react";
import SunEditor from 'suneditor-react';


const MyComponent = ({ content, setContent }: { content: any, setContent: any }) => {

    return (
        <SunEditor lang="pt_br"
            setDefaultStyle={`font-size: 18px;font-family: arial;color: rgb(85, 90, 95);background-color:rgb(252, 252, 255)`}
            height="850"
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
                        'preview']]
            }} />
    );
};
export default MyComponent;