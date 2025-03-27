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
import { HeadingNode } from '@lexical/rich-text';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
    $createParagraphNode,
    $createTextNode,
    $insertNodes,
} from 'lexical';
import { $createHeadingNode } from '@lexical/rich-text';
import {
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    $getRoot,
    $getTextContent
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { RiPenNibLine, RiAlignLeft, RiAlignRight, RiAlignJustify, RiAlignCenter } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { BsListCheck } from "react-icons/bs";
import { IoDocumentOutline, IoCodeSlash } from "react-icons/io5";
import { MdOutlineWbSunny } from "react-icons/md";
import { GoLink } from "react-icons/go";
import { FaListUl, FaListOl } from "react-icons/fa";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineGlobal } from "react-icons/ai";
import { LuPencil } from "react-icons/lu";
import { useUser } from '../../../../context/UserContext';
import { useParams } from "next/navigation";

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
        heading: {
            h1: 'text-3xl font-bold mb-4',
            h2: 'text-2xl font-semibold mb-3',
            h3: 'text-xl font-semibold mb-2',
            h4: 'text-lg font-semibold mb-1',
            h5: 'text-md font-semibold',
            h6: 'text-sm font-semibold',
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
        HeadingNode,
        ListNode,
        ListItemNode,
        LinkNode,
        AutoLinkNode,
    ],
};

export default function LexicalSeoEditor({data}) {

    const [ sourceMode, setSourceMode ] = useState(false);
    const [ htmlContent, setHtmlContent ] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();
    const { queryID } = useParams();

    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className="rounded-md border border-gray-300 bg-white p-3 space-y-1">

                {/* Loading banner */}
                {isLoading && (
                    <div className="absolute justify-center mx-auto my-auto bg-blue-100 text-blue-700 text-sm py-2 px-4 rounded-t-md flex items-center space-x-2 z-10">
                        <svg className="animate-spin h-4 w-4 text-blue-500" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        <span>Generating SEO-TXL Questions...</span>
                    </div>
                )}

                <FormatToolbar
                    setSourceMode={setSourceMode}
                    setHtmlContent={setHtmlContent}
                />
                <SeoTxlToolbar data = {data} setIsLoading={setIsLoading} queryID = {queryID} email = {user.email} />
                <SeoTranslateDropdown />
                <EditorArea />
            </div>

            {sourceMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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

    const applyHeadingBlock = (tag) => {
        editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            const nodes = selection.getNodes();

            for (const node of nodes) {
                const block = node.getTopLevelElementOrThrow();
                const type = block.getType();

                if (type !== 'paragraph' && type !== 'heading') continue;

                const newNode =
                    tag === 'paragraph'
                        ? $createParagraphNode()
                        : $createHeadingNode(tag);

                // Move children from old block to new block
                const children = block.getChildren();
                block.replace(newNode);
                for (const child of children) {
                    newNode.append(child);
                }

                // Move selection into new node
                newNode.selectEnd();
            }
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-0 border-b pb-2 border-gray-300">
            <select
                className="px-3 py-2 text-md rounded cursor-pointer hover:bg-blue-100 focus:outline-none"
                onChange={(e) => applyHeadingBlock(e.target.value)}
            >
                <option value="paragraph">Paragraph</option>
                <option value="h1" className="text-3xl font-semibold hover:bg-blue-100">h1</option>
                <option value="h2" className="text-2xl font-semibold hover:bg-blue-100">h2</option>
                <option value="h3" className="text-xl font-semibold hover:bg-blue-100">h3</option>
                <option value="h4" className="text-lg font-semibold hover:bg-blue-100">h4</option>
                <option value="h5" className="text-md font-semibold hover:bg-blue-100">h5</option>
                <option value="h6" className="text-sm font-semibold hover:bg-blue-100">h6</option>
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
function SeoTxlToolbar({ data, setIsLoading, queryID, email }) {

    const [editor] = useLexicalComposerContext();


    const handleSEO_TXLQuestions = async () => {
        const query = data.query;
        const keywords = data?.optimizationLevels?.map(item => item.keyword);

        try {
            setIsLoading(true);
            const response = await fetch("/api/generate_seo_questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, keywords, queryID : queryID, email : email }),
            });

            const result = await response.json();

            if (!result.success || !Array.isArray(result.questions)) {
                console.error("Failed to generate questions", result);
                return;
            }

            const questions = result.questions;

            editor.update(() => {
                const nodes = questions.map((q, i) =>
                    $createParagraphNode().append($createTextNode(`${i + 1}. ${q}`))
                );

                $insertNodes(nodes); // ✅ Correct way to insert nodes
            });
        } catch (err) {
            console.error("Error generating SEO-TXL Questions:", err);
        }finally {
            setIsLoading(false); // Done
        }
    }

    const handleSeoTxlOutline = async () => {
        const query = data.query;
        const keywords = data?.optimizationLevels?.map(item => item.keyword);
        setIsLoading(true); // Optional loading state

        try {
            const response = await fetch("/api/generate_seo_outline", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, keywords, queryID : queryID, email : email }),
            });

            const result = await response.json();

            if (!result.success || !Array.isArray(result.outlines)) {
                console.error("Failed to generate outlines", result);
                return;
            }

            const outlines = result.outlines;

            editor.update(() => {
                const nodes = outlines.map((q, i) =>
                    $createParagraphNode().append($createTextNode(`${i + 1}. ${q}`))
                );

                $insertNodes(nodes); // ✅ Correct way to insert nodes
            });
        } catch (err) {
            console.error("Failed to generate outline", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSeoTxlAuto = async () => {
        const root = editor.getRootElement();
        const currentText = root.innerText.trim();

        if (!currentText) return;

        setIsLoading(true); // Optional loading indicator

        try {
            const response = await fetch("/api/generate_seo_auto", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentText, queryID : queryID, email : email }),
            });

            const result = await response.json();

            if (!result.success || !result.autoText) {
                console.error("Failed to generate auto content", result);
                return;
            }

            const autoText = result.autoText;

            editor.update(() => {
                const textLines = Array.isArray(autoText)
                    ? autoText
                    : autoText.split(/\n+/).filter(line => line.trim() !== "");

                const nodes = textLines.map((line, i) =>
                    $createParagraphNode().append($createTextNode(line.trim()))
                );

                $insertNodes(nodes);
            });
        } catch (err) {
            console.error("Failed to run SEO-TXL Auto:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSeoTxlRephrase = async () => {
        const root = editor.getRootElement();
        const currentText = root.innerText.trim(); // Get the raw text from the editor

        if (!currentText) return;

        setIsLoading(true); // Show loading indicator

        try {
            const response = await fetch("/api/generate_seo_rephrase", {  // Use the correct endpoint
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentText, queryID : queryID, email : email }), // Send the current text to be rephrased
            });

            const result = await response.json();
            if (!result.success || !result.rephrasedText) {
                console.error("Failed to rephrase the content:", result);
                return;
            }

            const rephrasedText = result.rephrasedText;

            // Now, update the editor with the rephrased content
            editor.update(() => {
                const lines = rephrasedText.split(/\n+/).filter(line => line.trim() !== "");
                const nodes = lines.map((line, i) =>
                    $createParagraphNode().append($createTextNode(line.trim()))
                );
                $insertNodes(nodes); // Insert the rephrased nodes into the editor
            });
        } catch (err) {
            console.error("Error during rephrase:", err);
        } finally {
            setIsLoading(false); // Hide the loading indicator
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-4 border-b border-gray-300 pb-2">
            <button className='flex items-center space-x-2 hover:bg-blue-100 py-2 px-1'>
                <RiPenNibLine/>
                <span className='text-sm'>SEO-TXL Writer</span>
            </button>
            <button
                className='flex items-center space-x-2 hover:bg-blue-100 py-2 px-1'
                onClick={handleSeoTxlAuto}
            >
                <FaRegEye/>
                <span className='text-sm'>SEO-TXL Auto</span>
            </button>
            <button
                className='flex items-center space-x-2 hover:bg-blue-100 py-2 px-1'
                onClick={handleSeoTxlOutline}
            >
                <BsListCheck/>
                <span className='text-sm'>SEO-TXL Outline</span>
            </button>
            <button
                className='flex items-center space-x-2 hover:bg-blue-100 py-2 px-1'
                onClick={() => handleSEO_TXLQuestions()}
            >
                <IoDocumentOutline/>
                <span className='text-sm'>SEO-TXL Questions</span>
            </button>
            <button
                className='flex items-center space-x-2 hover:bg-blue-100 py-2 px-1'
                onClick={handleSeoTxlRephrase}
            >
                <MdOutlineWbSunny/>
                <span className='text-sm'>SEO-TXL Rephrase</span>
            </button>
        </div>
    );
}

// Translate dropdown
function SeoTranslateDropdown() {

    const [selectedLanguage, setSelectedLanguage] = useState(''); // state to track the selected value

    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
    };

    return (
        <div className="border-b pb-2 border-gray-300  shadow-lg">
            <Menu>
                <MenuButton className="text-black cursor-pointer">
                    <div className='flex items-center space-x-2 text-black hover:bg-blue-100 hover:text-black rounded-md px-3 py-2 text-md font-medium'>
                        <AiOutlineGlobal/>
                        <span className="text-sm">SEO-TXL Translate to...</span>
                        <IoIosArrowDown/>
                    </div>
                </MenuButton>
                <MenuItems
                    anchor="bottom start"
                    className="[--anchor-gap:8px] [--anchor-padding:8px] rounded-md bg-white shadow-2xl"
                >
                    <MenuItem>
                        <div className="flex items-center space-x-4 px-5 py-2 hover:bg-blue-100">
                            <LuPencil/>
                            <span className="text-sm">English</span>
                        </div>
                    </MenuItem>
                    <MenuItem>
                        <div className="flex items-center space-x-4 px-5 py-2 hover:bg-blue-100">
                            <LuPencil/>
                            <span className="text-sm">French</span>
                        </div>
                    </MenuItem>
                    <MenuItem>
                        <div className="flex items-center space-x-4 px-5 py-2 hover:bg-blue-100">
                            <LuPencil/>
                            <span className="text-sm">Spanish</span>
                        </div>
                    </MenuItem>
                    <MenuItem>
                        <div className="flex items-center space-x-4 px-5 py-2 hover:bg-blue-100">
                            <LuPencil/>
                            <span className="text-sm">German</span>
                        </div>
                    </MenuItem>
                    <MenuItem>
                        <div className="flex items-center space-x-4 px-5 py-2 hover:bg-blue-100">
                            <LuPencil/>
                            <span className="text-sm">Dutch</span>
                        </div>
                    </MenuItem>
                    <MenuItem>
                        <div className="flex items-center space-x-4 px-5 py-2 hover:bg-blue-100">
                            <LuPencil/>
                            <span className="text-sm">Italian</span>
                        </div>
                    </MenuItem>
                    <MenuItem>
                        <div className="flex items-center space-x-4 px-5 py-2 hover:bg-blue-100">
                            <LuPencil/>
                            <span className="text-sm">Portuguese(Portugal)</span>
                        </div>
                    </MenuItem>
                    <MenuItem>
                        <div className="flex items-center space-x-4 px-5 py-2 hover:bg-blue-100">
                            <LuPencil/>
                            <span className="text-sm">Portuguese(Brazil)</span>
                        </div>
                    </MenuItem>
                    <MenuItem>
                        <div className="flex items-center space-x-4 px-5 py-2 hover:bg-blue-100">
                            <LuPencil/>
                            <span className="text-sm">Polish</span>
                        </div>
                    </MenuItem>
                    <MenuItem>
                        <div className="flex items-center space-x-4 px-5 py-2 hover:bg-blue-100">
                            <LuPencil/>
                            <span className="text-sm">Romanian</span>
                        </div>
                    </MenuItem>
                </MenuItems>
            </Menu>
        </div>
    );
}

// Rich Text Editor Area
function EditorArea({handleChange}) {
    return (
        <>
            <RichTextPlugin
                contentEditable={
                    <ContentEditable className="h-[250px] overflow-y-auto outline-none p-2 text-sm" />
                }
                placeholder={<div className="text-gray-400 px-2">Start writing here...</div>}
                ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <LinkPlugin />
            <ListPlugin />
            <OnChangePlugin />
        </>
    );
}
