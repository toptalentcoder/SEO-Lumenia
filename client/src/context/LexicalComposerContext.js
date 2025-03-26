// LexicalContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

const LexicalContext = createContext(null);

// This is the provider for the context
export const LexicalProvider = ({ children }) => {
    const [editorState, setEditorState] = useState(null);
    const [editor] = useLexicalComposerContext();

    // Update the state whenever the editor is initialized or updated
    useEffect(() => {
        if (editor) {
            setEditorState(editor);
        }
    }, [editor]);

    const triggerAnalyse = async () => {
        if (!editorState) return;

        try {
            const content = editorState.getEditorState().read(() => {
                return editorState.getEditorState().getText();
            });

            console.log('Content from Lexical:', content);

            // Call your API or trigger further analysis here
            const response = await fetch('/api/calculate_optimization_levels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentText: [content], // Send content as an array
                    keywords: [], // Your keywords here
                }),
            });

            const result = await response.json();
            if (result.success) {
                console.log('Analysis result:', result);
            } else {
                console.error('Error in optimization response');
            }
        } catch (error) {
            console.error('Error during analysis:', error);
        }
    };

    return (
        <LexicalContext.Provider value={{ triggerAnalyse }}>
            {children}
        </LexicalContext.Provider>
    );
};

// Custom hook to access the context
export const useLexicalContext = () => {
    return useContext(LexicalContext);
};
