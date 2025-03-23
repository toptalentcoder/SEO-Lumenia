"use client"

import { useEffect, useState } from "react";
import React from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { ListItemNode, ListNode } from '@lexical/list';
import { $createListNode, INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
import { FORMAT_ELEMENT_COMMAND } from 'lexical';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { RiPenNibLine, RiAlignLeft, RiAlignRight, RiAlignJustify, RiAlignCenter } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { BsListCheck } from "react-icons/bs";
import { IoDocumentOutline, IoCodeSlash } from "react-icons/io5";
import { MdOutlineWbSunny } from "react-icons/md";
import { MdLanguage } from "react-icons/md";
import { GoLink } from "react-icons/go";
import { FaListUl, FaListOl } from "react-icons/fa";

const editorConfig = {
    namespace: 'SEO-TXL',
    onError(error) {
        console.error('Lexical Error:', error);
    },
    theme: {
        paragraph: 'mb-2',
        text: {
            bold: 'font-bold',
            italic: 'italic',
            underline: 'underline',
            strikethrough: 'line-through',
            subscript: 'align-sub text-xs',
            superscript: 'align-super text-xs',
        },
        list: {
            ul: 'list-disc list-inside',
            ol: 'list-decimal list-inside',
            listitem: 'mb-1',
        },
        align: {
            left: 'text-left',
            center: 'text-center',
            right: 'text-right',
            justify: 'text-justify',
        },
    },
    nodes: [
        ListNode,
        ListItemNode,
        LinkNode,
        AutoLinkNode,
    ],
};

export default function LexicalSeoEditor() {

    const [ sourceMode, setSourceMode ] = useState(false);
    const [ htmlContent, setHtmlContent ] = useState('');

    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className="rounded-md border border-gray-300 bg-white p-3 space-y-1">
                <FormatToolbar
                    setSourceMode={setSourceMode}
                    setHtmlContent={setHtmlContent}
                />
                <SeoTxlToolbar />
                <SeoTranslateDropdown />
                <EditorArea />
            </div>

            {sourceMode && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white p-4 rounded shadow-lg w-full max-w-3xl">
                        <h2 className="text-lg font-semibold mb-2">🧾 Source Code</h2>
                        <textarea
                            value={htmlContent}
                            onChange={(e) => setHtmlContent(e.target.value)}
                            className="w-full h-[300px] border border-gray-300 rounded p-2 font-mono text-sm"
                        />
                        <div className="flex justify-end mt-3">
                            <button
                                onClick={() => setSourceMode(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </LexicalComposer>
    );
}

// Formatting Toolbar
function FormatToolbar( { setSourceMode, setHtmlContent } ) {
    const [editor] = useLexicalComposerContext();

    const format = (style) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) selection.formatText(style);
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-0 border-b pb-2 border-gray-300">
            <select className="px-3 py-2 text-md rounded cursor-pointer hover:bg-blue-100 focus:outline-none">
                <option>Paragraph</option>
                <option className="text-3xl font-semibold hover:bg-blue-100">h1</option>
                <option className="text-2xl font-semibold hover:bg-blue-100">h2</option>
                <option className="text-xl font-semibold hover:bg-blue-100">h3</option>
                <option className="text-lg font-semibold hover:bg-blue-100">h4</option>
                <option className="text-md font-semibold hover:bg-blue-100">h5</option>
                <option className="text-sm font-semibold hover:bg-blue-100">h6</option>
            </select>
            <button onClick={() => format('bold')} className="font-boldn px-3 py-1 font-semibold hover:bg-blue-100 ml-6">B</button>
            <button onClick={() => format('italic')} className="italic px-3 py-1 font-semibold hover:bg-blue-100">I</button>
            <button onClick={() => format('underline')} className="underline px-3 py-1 font-semibold hover:bg-blue-100">U</button>
            <button onClick={() => format('strikethrough')} className="line-through px-3 py-1 font-semibold hover:bg-blue-100">S</button>
            <button onClick={() => format('subscript')} className="text-xs px-3 py-1 font-semibold hover:bg-blue-100 ml-4">X₂</button>
            <button onClick={() => format('superscript')} className="text-xs px-3 py-1 font-semibold hover:bg-blue-100">X²</button>
            <button
                onClick={() => {
                    const url = prompt("Enter URL");
                    if (!url) return;
                    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
                }}
                className="text-lg px-3 py-1 font-semibold hover:bg-blue-100 ml-4"
            >
                <GoLink />
            </button>
            <button
                onClick={() => {
                    editor.update(() => {
                        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
                    });
                }}
                className="text-lg px-3 py-1 font-semibold hover:bg-blue-100 ml-4"
            >
                <FaListUl />
            </button>
            <button
                onClick={() => {
                    editor.update(() => {
                        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
                    });
                }}
                className="text-lg px-3 py-1 font-semibold hover:bg-blue-100"
            >
                <FaListOl />
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
                className="text-lg px-2 py-1 hover:bg-blue-100 ml-4"
            >
                <RiAlignLeft />
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
                className="text-lg px-2 py-1 hover:bg-blue-100"
            >
                <RiAlignCenter />
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
                className="text-lg px-2 py-1 hover:bg-blue-100"
            >
                <RiAlignRight />
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
                className="text-lg px-2 py-1 hover:bg-blue-100"
            >
                <RiAlignJustify />
            </button>

            <button
                onClick={() => {
                    const html = editor.getRootElement().innerHTML;
                    setHtmlContent(html);
                    setSourceMode(true);
                }}
                className="text-lg px-2 py-1 hover:bg-blue-100 ml-4"
            >
                <IoCodeSlash />
            </button>
            <button className="text-md ml-auto text-gray-700 px-2 py-1 hover:bg-blue-100 rounded">▶ Import URL</button>
        </div>
    );
}

// SEO-TXL Toolbar
function SeoTxlToolbar() {

    return (
        <div className="flex flex-wrap items-center gap-4 border-b border-gray-300 pb-2">
            <button className='flex items-center space-x-2 hover:bg-blue-100 py-2 px-1'>
                <RiPenNibLine/>
                <span className='text-sm'>SEO-TXL Writer</span>
            </button>
            <button className='flex items-center space-x-2 hover:bg-blue-100 py-2 px-1'>
                <FaRegEye/>
                <span className='text-sm'>SEO-TXL Auto</span>
            </button>
            <button className='flex items-center space-x-2 hover:bg-blue-100 py-2 px-1'>
                <BsListCheck/>
                <span className='text-sm'>SEO-TXL Outline</span>
            </button>
            <button className='flex items-center space-x-2 hover:bg-blue-100 py-2 px-1'>
                <IoDocumentOutline/>
                <span className='text-sm'>SEO-TXL Questions</span>
            </button>
            <button className='flex items-center space-x-2 hover:bg-blue-100 py-2 px-1'>
                <MdOutlineWbSunny/>
                <span className='text-sm'>SEO-TXL Rephrase</span>
            </button>
        </div>
    );
}

// Translate dropdown
function SeoTranslateDropdown() {
    return (
        <div className="border-b pb-2 border-gray-300  shadow-lg">
            <select className="text-sm px-3 py-1 rounded hover:bg-blue-100">
                <option>
                    <div  className='flex items-center space-x-2'>
                        <MdLanguage className='w-2 h-2'/>
                        <span>SEO-TXL Translate to...</span>
                    </div>

                </option>
                <option>English</option>
                <option>French</option>
                <option>German</option>
            </select>
        </div>
    );
}

// Rich Text Editor Area
function EditorArea() {
    return (
        <>
            <RichTextPlugin
                contentEditable={
                    <ContentEditable className="min-h-[200px] outline-none p-2 text-sm" />
                }
                placeholder={<div className="text-gray-400 px-2">Start writing here...</div>}
                ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <LinkPlugin />
            <ListPlugin />
            <OnChangePlugin onChange={(editorState) => {
                editorState.read(() => {
                    // read state here if needed
                });
            }} />
        </>
    );
}
