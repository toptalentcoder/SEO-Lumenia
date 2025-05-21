"use client"

import { useEffect, useState, useRef } from "react";
import React from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode } from '@lexical/rich-text';
import { LinkNode, AutoLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import {
    $createParagraphNode,
    $createTextNode,
    $insertNodes,
    $getSelection,
    $isRangeSelection,
    FORMAT_ELEMENT_COMMAND,
    $getRoot
} from 'lexical';
import { $createHeadingNode } from '@lexical/rich-text';
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
import axios from 'axios';
import LottieLoader from '../../../../components/ui/LottieLoader';

const editorConfig = {
    namespace: 'SEO-TXL',
    onError(error) {
        console.error('Lexical Error:', error);
    },
    theme: {
        paragraph: 'mb-2 text-gray-800',
        text: {
            bold: 'font-bold text-gray-800',
            italic: 'italic text-gray-800',
            underline: 'underline text-gray-800',
            strikethrough: 'line-through text-gray-800',
            subscript: 'align-sub text-xs text-gray-800',
            superscript: 'align-super text-xs text-gray-800',
        },
        heading: {
            h1: 'text-3xl font-bold mb-4 text-gray-800',
            h2: 'text-2xl font-semibold mb-3 text-gray-800',
            h3: 'text-xl font-semibold mb-2 text-gray-800',
            h4: 'text-lg font-semibold mb-1 text-gray-800',
            h5: 'text-md font-semibold text-gray-800',
            h6: 'text-sm font-semibold text-gray-800',
        },
        list: {
            ul: 'list-disc list-inside text-gray-800',
            ol: 'list-decimal list-inside text-gray-800',
            listitem: 'mb-1',
        },
        align: {
            left: 'text-left text-gray-800',
            center: 'text-center text-gray-800',
            right: 'text-right text-gray-800',
            justify: 'text-justify text-gray-800',
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

function LexicalEditorInner({
    data,
    onDirtyChange,
    editorRef,
    seoEditorData,
    isLoading,
    setIsLoading,
    sourceMode,
    setSourceMode,
    htmlContent,
    setHtmlContent,
    onEditorJSONUpdate
}) {
    const { user } = useUser();
    const { queryID } = useParams();
    const [editor] = useLexicalComposerContext();

    // Assign DOM ref for external access
    useEffect(() => {
        if (editorRef && editorRef.current === null) {
            editorRef.current = editor.getRootElement();
        }
    }, [editor, editorRef]);

    return (
        <div className="rounded-md border border-gray-300 bg-white p-3 space-y-1">
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
                    <LottieLoader />
                </div>
            )}

            <FormatToolbar setSourceMode={setSourceMode} setHtmlContent={setHtmlContent} />
            <SeoTxlToolbar
                data={data}
                setIsLoading={setIsLoading}
                queryID={queryID}
                email={user?.email}
            />
            <SeoTranslateDropdown setIsLoading={setIsLoading} />
            <EditorArea seoEditorData={seoEditorData} onDirtyChange={onDirtyChange}  editorRef={editorRef}   onEditorJSONUpdate={onEditorJSONUpdate}/>

            {sourceMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-black/50 text-gray-800">
                    <div className="bg-white p-4 rounded shadow-lg w-full max-w-3xl">
                        <h2 className="text-lg font-semibold mb-2">🧾 Source Code</h2>
                        <textarea
                            value={seoEditorData}
                            onChange={(e) => setSeoEditorData(e.target.value)}
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
        </div>
    );
}

export default function LexicalSeoEditor({data, onDirtyChange, editorRef, onEditorJSONUpdate }) {

    const [seoEditorData, setSeoEditorData] = useState("");
    const [ sourceMode, setSourceMode ] = useState(false);
    const [ htmlContent, setHtmlContent ] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();
    const { queryID } = useParams();

    const initialEditorState = () => {
        try {
            if (seoEditorData && JSON.parse(seoEditorData)) {
                return JSON.parse(seoEditorData);
            }
        } catch (_) {}
        return null;
    };
      
    useEffect(() => {
        setSeoEditorData(""); // Clear existing data on queryID change
    }, [queryID]);

    useEffect(() => {
        const fetchSeoEditorData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(
                    `/api/get_seo_editor_data?queryID=${queryID}&email=${user?.email}`
                );

                if (response.data.success) {
                    setSeoEditorData(response.data.seoEditorData);
                }
            } catch (error) {
                console.error("❌ Failed to fetch SEO Editor Data:", err?.response?.data || err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSeoEditorData();
    }, [queryID, user?.email]);

    return (

        <LexicalComposer
            initialConfig={{
                ...editorConfig,
                editorState: (editor) => {
                    try {
                        if (seoEditorData) {
                            // If seoEditorData is a string (not JSON), create a paragraph node
                            if (typeof seoEditorData === 'string' && !seoEditorData.startsWith('{')) {
                                const root = editor.getRootElement();
                                const lines = seoEditorData.split('\n').filter(line => line.trim());
                                const nodes = lines.map(line => {
                                    // Check if line matches heading pattern (e.g., "1.1 Introduction")
                                    const headingMatch = line.match(/^(\d+(\.\d+)*)\s+(.+)$/);
                                    if (headingMatch) {
                                        const depth = headingMatch[1].split('.').length;
                                        const content = headingMatch[3];
                                        const headingNode = $createHeadingNode(depth === 1 ? 'h1' : depth === 2 ? 'h2' : 'h3');
                                        headingNode.append($createTextNode(line));
                                        return headingNode;
                                    }
                                    // Regular paragraph
                                    const paragraphNode = $createParagraphNode();
                                    paragraphNode.append($createTextNode(line));
                                    return paragraphNode;
                                });
                                editor.update(() => {
                                    const root = $getRoot();
                                    root.clear();
                                    $insertNodes(nodes);
                                });
                            } else {
                                // Handle JSON format
                                const parsed = JSON.parse(seoEditorData);
                                const editorState = editor.parseEditorState(parsed);
                                editor.setEditorState(editorState);
                            }
                        }
                    } catch (err) {
                        console.error("Error setting editor state:", err);
                    }
                },
            }}
        >

        <LexicalEditorInner
            data={data}
            onDirtyChange={onDirtyChange}
            editorRef={editorRef}
            seoEditorData={seoEditorData}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            sourceMode={sourceMode}
            setSourceMode={setSourceMode}
            htmlContent={htmlContent}
            setHtmlContent={setHtmlContent}
            onEditorJSONUpdate={onEditorJSONUpdate}
        />
        </LexicalComposer>
    );
}

// Formatting Toolbar
function FormatToolbar({ setSourceMode, setHtmlContent }) {
    const [editor] = useLexicalComposerContext();
    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
        subscript: false,
        superscript: false,
        alignment: 'left',
        list: null
    });

    // Update active formats based on current selection
    useEffect(() => {
        const removeUpdateListener = editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    const format = selection.format;
                    const node = selection.anchor.getNode();
                    const parent = node.getParent();
                    
                    // Check if parent is a list item and determine list type
                    let listType = null;
                    if (parent && parent.getType() === 'listitem') {
                        const listParent = parent.getParent();
                        if (listParent) {
                            listType = listParent.getType() === 'list' ? 
                                (listParent.getListType() === 'number' ? 'ol' : 'ul') : null;
                        }
                    }

                    setActiveFormats({
                        bold: format & 1,
                        italic: format & 2,
                        underline: format & 4,
                        strikethrough: format & 8,
                        subscript: format & 16,
                        superscript: format & 32,
                        alignment: parent?.getFormatType() || 'left',
                        list: listType
                    });
                }
            });
        });

        return () => {
            removeUpdateListener();
        };
    }, [editor]);

    const format = (style) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                selection.formatText(style);
            }
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

                const children = block.getChildren();
                block.replace(newNode);
                for (const child of children) {
                    newNode.append(child);
                }

                newNode.selectEnd();
            }
        });
    };

    const handleInsertUrl = () => {
        const url = prompt("Enter the URL:");

        if (url) {
            editor.update(() => {
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
            });
        }
    };

    const handleAlignment = (alignment) => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
    };

    const handleList = (type) => {
        editor.update(() => {
            editor.dispatchCommand(type === 'ul' ? INSERT_UNORDERED_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND);
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-0 border-b pb-2 border-gray-300">
            <select
                className="px-3 py-2 text-md rounded cursor-pointer hover:bg-blue-100 focus:outline-none text-gray-800"
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
            <button 
                onClick={() => format('bold')} 
                className={`px-3 py-1 font-semibold hover:bg-blue-100 ml-6 text-gray-800 ${activeFormats.bold ? 'bg-blue-500 text-white' : ''}`}
            >
                B
            </button>
            <button 
                onClick={() => format('italic')} 
                className={`italic px-3 py-1 font-semibold hover:bg-blue-100 text-gray-800 ${activeFormats.italic ? 'bg-blue-500 text-white' : ''}`}
            >
                I
            </button>
            <button 
                onClick={() => format('underline')} 
                className={`underline px-3 py-1 font-semibold hover:bg-blue-100 text-gray-800 ${activeFormats.underline ? 'bg-blue-500 text-white' : ''}`}
            >
                U
            </button>
            <button 
                onClick={() => format('strikethrough')} 
                className={`line-through px-3 py-1 font-semibold hover:bg-blue-100 text-gray-800 ${activeFormats.strikethrough ? 'bg-blue-500 text-white' : ''}`}
            >
                S
            </button>
            <button 
                onClick={() => format('subscript')} 
                className={`text-xs px-3 py-1 font-semibold hover:bg-blue-100 ml-4 text-gray-800 ${activeFormats.subscript ? 'bg-blue-500 text-white' : ''}`}
            >
                X₂
            </button>
            <button 
                onClick={() => format('superscript')} 
                className={`text-xs px-3 py-1 font-semibold hover:bg-blue-100 text-gray-800 ${activeFormats.superscript ? 'bg-blue-500 text-white' : ''}`}
            >
                X²
            </button>
            <button
                onClick={handleInsertUrl}
                className="text-lg px-3 py-1 font-semibold hover:bg-blue-100 ml-4 text-gray-800"
            >
                <GoLink />
            </button>
            <button
                onClick={() => handleList('ul')}
                className={`text-lg px-3 py-1 font-semibold hover:bg-blue-100 ml-4 text-gray-800 ${activeFormats.list === 'ul' ? 'bg-blue-500 text-white' : ''}`}
            >
                <FaListUl />
            </button>
            <button
                onClick={() => handleList('ol')}
                className={`text-lg px-3 py-1 font-semibold hover:bg-blue-100 text-gray-800 ${activeFormats.list === 'ol' ? 'bg-blue-500 text-white' : ''}`}
            >
                <FaListOl />
            </button>
            <button
                onClick={() => handleAlignment('left')}
                className={`text-lg px-2 py-1 hover:bg-blue-100 ml-4 text-gray-800 ${activeFormats.alignment === 'left' ? 'bg-blue-500 text-white' : ''}`}
            >
                <RiAlignLeft />
            </button>
            <button
                onClick={() => handleAlignment('center')}
                className={`text-lg px-2 py-1 hover:bg-blue-100 text-gray-800 ${activeFormats.alignment === 'center' ? 'bg-blue-500 text-white' : ''}`}
            >
                <RiAlignCenter />
            </button>
            <button
                onClick={() => handleAlignment('right')}
                className={`text-lg px-2 py-1 hover:bg-blue-100 text-gray-800 ${activeFormats.alignment === 'right' ? 'bg-blue-500 text-white' : ''}`}
            >
                <RiAlignRight />
            </button>
            <button
                onClick={() => handleAlignment('justify')}
                className={`text-lg px-2 py-1 hover:bg-blue-100 text-gray-800 ${activeFormats.alignment === 'justify' ? 'bg-blue-500 text-white' : ''}`}
            >
                <RiAlignJustify />
            </button>

            <button
                onClick={() => {
                    const html = editor.getRootElement().innerHTML;
                    setHtmlContent(html);
                    setSourceMode(true);
                }}
                className="text-lg px-2 py-1 hover:bg-blue-100 ml-4 text-gray-800"
            >
                <IoCodeSlash />
            </button>
            <button className="text-md ml-auto px-2 py-1 hover:bg-blue-100 rounded text-gray-800">▶ Import URL</button>
        </div>
    );
}

// SEO-TXL Toolbar
function SeoTxlToolbar({ data, setIsLoading, queryID, email }) {
    const [editor] = useLexicalComposerContext();
    const { user } = useUser();

    const handleSEO_TXLQuestions = async () => {
        const query = data.query;
        const keywords = data?.optimizationLevels?.map(item => item.keyword);
        const language = data.language || "English";

        try {
            setIsLoading(true);
            const response = await fetch("/api/generate_seo_questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, keywords, language, queryID: queryID, email: email }),
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
        } finally {
            setIsLoading(false); // Done
        }
    }

    const handleSeoTxlOutline = async () => {
        const query = data.query;
        const keywords = data?.optimizationLevels?.map(item => item.keyword);
        const language = data.language || "English";
        setIsLoading(true);
    
        try {
            const response = await fetch("/api/generate_seo_outline", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, keywords, language, queryID, email }),
            });
    
            const result = await response.json();
    
            if (!result.success || !Array.isArray(result.outline)) {
                console.error("Failed to generate outline", result);
                return;
            }
    
            const outline = result.outline;
    
            editor.update(() => {
                const nodes = outline.map((line) => {
                    const trimmed = line.trim();
                    const match = trimmed.match(/^(\d+(\.\d+)*)(\s*-?\s*)?(.*)$/);
    
                    if (!match) {
                        return $createParagraphNode().append($createTextNode(trimmed)); 
                    }
    
                    const levelStr = match[1];       // e.g., "1.1"
                    const content = match[4] || "";  // e.g., "Introduction"
                    const depth = levelStr.split(".").length;
    
                    const fullText = `${levelStr} ${content}`;
    
                    if (depth === 2) {
                        return $createHeadingNode("h3").append($createTextNode(fullText));
                      } else if (depth === 3) {
                        return $createHeadingNode("h4").append($createTextNode(fullText));
                      } else {
                        return $createParagraphNode().append($createTextNode(fullText));
                      }
                });
    
                $insertNodes(nodes);
            });
        } catch (err) {
            console.error("Error generating SEO-TXL Outline:", err);
        } finally {
            setIsLoading(false);
        }
    };
    
    

    const handleSeoTxlAuto = async () => {
        const root = editor.getRootElement();
        const currentText = root.innerText.trim();
        if (!currentText) return;

        setIsLoading(true);

        try {
            const response = await fetch("/api/generate_seo_auto", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentText,
                    queryID,
                    email: user.email,
                }),
            });

            const result = await response.json();
            if (result.success && result.autoText) {
                editor.update(() => {
                    $getRoot().clear();

                    const lines = result.autoText.split(/\n+/).filter(line => line.trim());
                    const nodes = lines.map((line) =>
                        $createParagraphNode().append($createTextNode(line.trim()))
                    );
                    $insertNodes(nodes);
                });
            } else {
                console.error("Auto-expansion failed:", result);
            }
        } catch (err) {
            console.error("Auto-expansion error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSeoTxlRephrase = async () => {
        const root = editor.getRootElement();
        const currentText = root.innerText.trim();
        if (!currentText) return;

        setIsLoading(true);

        try {
            const response = await fetch("/api/generate_seo_rephrase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentText,
                    queryID,
                    email: user.email,
                }),
            });

            const result = await response.json();
            if (result.success && result.rephrasedText) {
                editor.update(() => {
                    $getRoot().clear();

                    const lines = result.rephrasedText.split(/\n+/).filter(line => line.trim());
                    const nodes = lines.map((line) =>
                        $createParagraphNode().append($createTextNode(line.trim()))
                    );
                    $insertNodes(nodes);
                });
            } else {
                console.error("Rephrasing failed:", result);
            }
        } catch (err) {
            console.error("Rephrasing error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-4 border-b border-gray-300 pb-2">
            <button className='flex items-center space-x-2 hover:bg-blue-100 py-2 px-1 text-gray-800'>
                <RiPenNibLine/>
                <span className='text-sm'>SEO-TXL Writer</span>
            </button>
            <button
                className='flex items-center space-x-2 hover:bg-blue-100 py-2 px-1 text-gray-800'
                onClick={handleSeoTxlAuto}
            >
                <FaRegEye/>
                <span className='text-sm'>SEO-TXL Auto</span>
            </button>
            <button
                className='flex items-center space-x-2 hover:bg-blue-100 py-2 px-1 text-gray-800'
                onClick={handleSeoTxlOutline}
            >
                <BsListCheck/>
                <span className='text-sm'>SEO-TXL Outline</span>
            </button>
            <button
                className='flex items-center space-x-2 hover:bg-blue-100 py-2 px-1 text-gray-800'
                onClick={() => handleSEO_TXLQuestions()}
            >
                <IoDocumentOutline/>
                <span className='text-sm'>SEO-TXL Questions</span>
            </button>
            <button
                className='flex items-center space-x-2 hover:bg-blue-100 py-2 px-1 text-gray-800'
                onClick={handleSeoTxlRephrase}
            >
                <MdOutlineWbSunny/>
                <span className='text-sm'>SEO-TXL Rephrase</span>
            </button>
        </div>
    );
}

// Translate dropdown
function SeoTranslateDropdown({setIsLoading}) {
    const [editor] = useLexicalComposerContext();
    const { user } = useUser();
    const { queryID } = useParams();

    const handleTranslate = async (language) => {
        const root = editor.getRootElement();
        const currentText = root.innerText.trim();
        if (!currentText) return;

        setIsLoading(true);

        try {
            const res = await fetch("/api/translate_seo_editor_text", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentText,
                    language,
                    queryID,
                    email: user.email,
                }),
            });

            const result = await res.json();
            if (result.success && result.translatedText) {
                editor.update(() => {
                    $getRoot().clear();

                    const lines = result.translatedText.split(/\n+/).filter(line => line.trim());
                    const nodes = lines.map((line) =>
                        $createParagraphNode().append($createTextNode(line.trim()))
                    );
                    $insertNodes(nodes);
                });
            } else {
                console.error("Translation failed:", result);
            }
        } catch (err) {
            console.error("Translation error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const languages = [
        "English",
        "French",
        "Spanish",
        "German",
        "Dutch",
        "Italian",
        "Portuguese(Portugal)",
        "Portuguese(Brazil)",
        "Polish",
        "Romanian",
    ];

    return (
        <div className="border-b pb-2 border-gray-300 shadow-lg text-gray-800">
            <Menu>
                <MenuButton className="cursor-pointer text-gray-800">
                    <div className="flex items-center space-x-2 text-black hover:bg-blue-100 hover:text-black rounded-md px-3 py-2 text-md font-medium">
                        <AiOutlineGlobal />
                        <span className="text-sm">SEO-TXL Translate to...</span>
                        <IoIosArrowDown />
                    </div>
                </MenuButton>
                <MenuItems
                    anchor="bottom start"
                    className="[--anchor-gap:8px] [--anchor-padding:8px] rounded-md bg-white shadow-2xl text-gray-800"
                >
                    {languages.map((lang) => (
                        <MenuItem key={lang}>
                            <div
                                className="flex items-center space-x-4 px-5 py-2 hover:bg-blue-100 cursor-pointer"
                                onClick={() => handleTranslate(lang)}
                            >
                                <LuPencil />
                                <span className="text-sm">{lang}</span>
                            </div>
                        </MenuItem>
                    ))}
                </MenuItems>
            </Menu>
        </div>
    );
}


// Rich Text Editor Area
function EditorArea({seoEditorData, onDirtyChange, editorRef, onEditorJSONUpdate }) {
    const [editor] = useLexicalComposerContext();
    const initialHTMLRef = useRef(""); // Store initial HTML
    const skipNextChange = useRef(false); // Track programmatic changes

    const isProbablyJson = (str) => {
        try {
            const obj = JSON.parse(str);
            return typeof obj === "object" && obj !== null;
        } catch (e) {
            return false;
        }
    };

    useEffect(() => {
        if (seoEditorData && editor) {
            skipNextChange.current = true;
    
            editor.update(() => {
                const root = $getRoot();
                root.clear();
    
                if (isProbablyJson(seoEditorData)) {
                    const newEditorState = editor.parseEditorState(JSON.parse(seoEditorData));
                    editor.setEditorState(newEditorState);
                } else {
                    // Handle plain text format
                    const lines = seoEditorData.split('\n').filter(line => line.trim());
                    const nodes = lines.map(line => {
                        // Check if line matches heading pattern (e.g., "1.1 Introduction")
                        const headingMatch = line.match(/^(\d+(\.\d+)*)\s+(.+)$/);
                        if (headingMatch) {
                            const depth = headingMatch[1].split('.').length;
                            const content = headingMatch[3];
                            const headingNode = $createHeadingNode(depth === 1 ? 'h1' : depth === 2 ? 'h2' : 'h3');
                            headingNode.append($createTextNode(line));
                            return headingNode;
                        }
                        // Regular paragraph
                        const paragraphNode = $createParagraphNode();
                        paragraphNode.append($createTextNode(line));
                        return paragraphNode;
                    });
                    $insertNodes(nodes);
                }
    
                setTimeout(() => {
                    initialHTMLRef.current = editor.getRootElement().innerHTML;
                    skipNextChange.current = false;
                }, 50);
            });
        }
    }, [seoEditorData, editor]);

    useEffect(() => {
        const handleResetDirty = () => {
            initialHTMLRef.current = editor.getRootElement().innerHTML;
            onDirtyChange(false);
        };

        window.addEventListener("seo-editor-reset-dirty", handleResetDirty);
        return () => window.removeEventListener("seo-editor-reset-dirty", handleResetDirty);
    }, [editor, onDirtyChange]);

    return (
        <>
            <RichTextPlugin
                contentEditable={
                    <ContentEditable
                        ref={editorRef}
                        className="h-[250px] overflow-y-auto outline-none p-2 text-sm"
                    />
                }
                placeholder={<div className="text-gray-400 px-2">Start writing here...</div>}
                ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <LinkPlugin />
            <ListPlugin />
            <OnChangePlugin
                onChange={(editorState) => {
                    if (skipNextChange.current) return;

                    const currentHTML = editor.getRootElement().innerHTML;

                    // Only fire dirty if it's different from initial
                    if (currentHTML !== initialHTMLRef.current) {
                        onDirtyChange(true);
                    }

                    // Save content to localStorage
                    // if (typeof window !== 'undefined') {
                    //     const editorStateJSON = editorState.toJSON();
                    //     localStorage.setItem('seoEditorContent', JSON.stringify(editorStateJSON));
                    // }

                    // Send JSON up
                    if (onEditorJSONUpdate) {
                        onEditorJSONUpdate(editorState.toJSON());
                    }
                }}
            />
        </>
    );
}