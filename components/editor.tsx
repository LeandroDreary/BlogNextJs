import React, { useRef } from 'react';
import dynamic from 'next/dynamic';

const importJodit = () => import('jodit-react');

const JoditEditor = dynamic(importJodit, {
    ssr: false,
});

const EditorComponent = ({ content, setContent }) => {
    
    return (
        <JoditEditor
            value={content}
            // config={config}
            // tabIndex={1} // tabIndex of textarea
            onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
            onChange={newContent => { setContent(newContent) }}
        />
    );
}

export default EditorComponent