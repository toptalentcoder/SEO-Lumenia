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
                email={user.email}
            />
            <SeoTranslateDropdown setIsLoading={setIsLoading} />
            <EditorArea seoEditorData={seoEditorData} onDirtyChange={onDirtyChange}  editorRef={editorRef} />

            {sourceMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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

export default function LexicalSeoEditor({data, onDirtyChange, editorRef }) {

    const [seoEditorData, setSeoEditorData] = useState("");
    const [ sourceMode, setSourceMode ] = useState(false);
    const [ htmlContent, setHtmlContent ] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();
    const { queryID } = useParams();
    const [hasUserEdited, setHasUserEdited] = useState(false);


    useEffect(() => {
        const fetchSeoEditorData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(
                    `/api/get_seo_editor_data?queryID=${queryID}&email=${user.email}`
                );

                if (response.data.success) {
                    setSeoEditorData(response.data.seoEditorData);
                }
            } catch (error) {
                setSeoEditorData("")
            } finally {
                setIsLoading(false);
            }
        };

        fetchSeoEditorData();
    }, [queryID, user.email]);

    return (
        <LexicalComposer initialConfig={editorConfig}>
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
        />
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

    const handleInsertUrl = () => {
        const url = prompt("Enter the URL:");

        if (url) {
            // Call Lexical's API to insert the URL as a link
            editor.update(() => {
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
            });
        }
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
            <button onClick={() => format('bold')} className="font-boldn px-3 py-1 font-semibold hover:bg-blue-100 ml-6 text-gray-800">B</button>
            <button onClick={() => format('italic')} className="italic px-3 py-1 font-semibold hover:bg-blue-100 text-gray-800">I</button>
            <button onClick={() => format('underline')} className="underline px-3 py-1 font-semibold hover:bg-blue-100 text-gray-800">U</button>
            <button onClick={() => format('strikethrough')} className="line-through px-3 py-1 font-semibold hover:bg-blue-100 text-gray-800">S</button>
            <button onClick={() => format('subscript')} className="text-xs px-3 py-1 font-semibold hover:bg-blue-100 ml-4 text-gray-800">X₂</button>
            <button onClick={() => format('superscript')} className="text-xs px-3 py-1 font-semibold hover:bg-blue-100 text-gray-800">X²</button>
            <button
                onClick={handleInsertUrl}
                className="text-lg px-3 py-1 font-semibold hover:bg-blue-100 ml-4 text-gray-800"
            >
                <GoLink />
            </button>
            <button
                onClick={() => {
                    editor.update(() => {
                        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
                    });
                }}
                className="text-lg px-3 py-1 font-semibold hover:bg-blue-100 ml-4 text-gray-800"
            >
                <FaListUl />
            </button>
            <button
                onClick={() => {
                    editor.update(() => {
                        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
                    });
                }}
                className="text-lg px-3 py-1 font-semibold hover:bg-blue-100 text-gray-800"
            >
                <FaListOl />
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
                className="text-lg px-2 py-1 hover:bg-blue-100 ml-4 text-gray-800"
            >
                <RiAlignLeft />
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
                className="text-lg px-2 py-1 hover:bg-blue-100 text-gray-800"
            >
                <RiAlignCenter />
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
                className="text-lg px-2 py-1 hover:bg-blue-100 text-gray-800"
            >
                <RiAlignRight />
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
                className="text-lg px-2 py-1 hover:bg-blue-100 text-gray-800"
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
        setIsLoading(true); // Optional loading state

        try {
            const response = await fetch("/api/generate_seo_outline", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, keywords, language, queryID: queryID, email: email }),
            });

            const result = await response.json();

            if (!result.success || !Array.isArray(result.outline)) {
                console.error("Failed to generate outline", result);
                return;
            }

            const outline = result.outline;

            editor.update(() => {
                const nodes = outline.map((line) =>
                    $createParagraphNode().append($createTextNode(line))
                );

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
function EditorArea({seoEditorData, onDirtyChange, editorRef  }) {

    const [editor] = useLexicalComposerContext();
    const initialHTMLRef = useRef(""); // Store initial HTML
    const skipNextChange = useRef(false); // Track programmatic changes

    // Only update the editor with the content when it's ready and the data is available
    useEffect(() => {
        if (seoEditorData && editor) {
            editor.update(() => {
                const textNode = $createTextNode(seoEditorData);
                const paragraphNode = $createParagraphNode().append(textNode);
                $insertNodes([paragraphNode]);
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

    // Load the initial content only once
    useEffect(() => {
        if (seoEditorData && editor) {
            skipNextChange.current = true; // prevent flag on programmatic insert

            editor.update(() => {
                const root = $getRoot();
                root.clear(); // ✅ This clears all child nodes safely
                const textNode = $createTextNode(seoEditorData);
                const paragraphNode = $createParagraphNode().append(textNode);
                $insertNodes([paragraphNode]);

                // Save initial HTML once it's inserted
                setTimeout(() => {
                    initialHTMLRef.current = editor.getRootElement().innerHTML;
                    skipNextChange.current = false;
                }, 50); // wait for DOM update
            });
        }
    }, [seoEditorData, editor]);

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
                onChange={() => {
                    if (skipNextChange.current) return;

                    const currentHTML = editor.getRootElement().innerHTML;

                    // Only fire dirty if it's different from initial
                    if (currentHTML !== initialHTMLRef.current) {
                        onDirtyChange(true);
                    }
                }}
            />
        </>
    );
}
