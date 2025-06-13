"use client"

import Image from 'next/image';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useState, useEffect } from "react";
import { US, FR } from 'country-flag-icons/react/3x2';
import { IoIosArrowDown } from 'react-icons/io';
import { FiPlus, FiMinus } from "react-icons/fi";

export default function DigitalBrainstormer(){

    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [results, setResults] = useState({});
    const [expandedId, setExpandedId] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState({
        hl: 'en',  // host language
        gl: 'us',  // country
        lr: 'lang_en', // language restrict
        label: 'English (USA)'
    });

    const flagMap = {
        us: <US />,
        fr: <FR />
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (!token) return;

        const fetchUserIdeas = async () => {
            try {
                const res = await fetch('/api/brainstormIdeas/me', {
                    headers: {
                        'Authorization': `JWT ${token}`,
                    },
                });
                const data = await res.json();

                const brainstorms = data.results?.docs || [];

                const all = {};
                const recent = brainstorms.map((doc) => {
                    const label = `#${doc.id.slice(-6)} ${doc.query}`;
                    all[label] = doc.ideas;
                    return { id: label, query: doc.query };
                });
                setHistory(recent);
                setResults(all);
            } catch (err) {
                console.error('Failed to load user brainstorms', err);
            }
        };

        fetchUserIdeas();
    }, []);

    const handleGenerateBrainstormIdeas = async () => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            alert("You're not logged in.");
            return;
        }

        if (!query.trim()) {
            alert("Please enter a query.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/generate-brainstormer-ideas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${token}`, // ✅ pass the JWT token
                },
                body: JSON.stringify({
                    query,
                    language: selectedLanguage.hl,
                }),
            });

            const data = await res.json();

            if (!res.ok) return alert(data.error || 'Failed to fetch ideas');

            const newId = `#${Math.floor(Math.random() * 1000000)} ${query}`;
            setHistory([{ id: newId, query, loading: false }, ...history]);
            setResults({ ...results, [newId]: data.data });
            setExpandedId(newId);
            setQuery("");
        } catch (error) {
            console.error('❌ Error:', error);
            alert('Error generating ideas.');
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = (id, query) => {
        const ideas = results[id] || [];
    
        const rows = [["Query", "Title", "Description", "Keywords", "Persona", "Outline", "Level"]];
        ideas.forEach((idea) => {
            rows.push([
                query,
                idea.title,
                idea.description,
                idea.keywords.map(k => k.keyword).join(", "),
                idea.persona,
                idea.outline.map(o => o.step).join(" | "),
                idea.level,
            ]);
        });
    
        const csvContent = rows.map(row =>
            row.map(field => `"${(field || "").replace(/"/g, '""')}"`).join(",")
        ).join("\n");
    
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
    
        const a = document.createElement("a");
        a.href = url;
        a.download = `brainstorm_${query.replace(/\s+/g, "_")}_${new Date().toISOString()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };
    


    const renderIdeasTable = (ideas) => (
        <table className="table-auto w-full text-sm mt-4 border-t">
            <thead className="text-left text-xs text-gray-500 border-b border-gray-200">
                <tr>
                <th className="px-2 py-4">Title</th>
                <th className="px-2 py-4">Keywords</th>
                <th className="px-2 py-4">Description</th>
                <th className="px-2 py-4">Outline</th>
                <th className="px-2 py-4">Persona</th>
                <th className="px-2 py-4">Level</th>
                </tr>
            </thead>
            <tbody>
                {ideas.map((idea, i) => (
                    <tr key={i} className="border-b odd:bg-gray-100 even:bg-white">
                        <td className="p-2 font-semibold text-[#4A4291]">{idea.title}</td>
                        <td className="p-2 text-gray-800">{idea.keywords.map(k => k.keyword).join(', ')}</td>
                        <td className="p-2 text-gray-800">{idea.description}</td>
                        <td className="p-2 text-gray-800">{idea.outline.map(o => o.step).join(', ')}</td>
                        <td className="p-2 text-gray-800">{idea.persona}</td>
                        <td className="p-2 capitalize text-gray-800">{idea.level}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div>
            <div className="m-6 bg-white rounded-xl shadow-sm">
                <div className='text-md text-gray-700 px-10 pt-6'>
                    Digital Brainstormer
                </div>

                <hr className="border-t border-1.5 border-gray-300 my-4" />

                <div className="bg-white rounded-xl p-10 flex items-start gap-7 mt-5">
                    <Image src="/images/gpeyronnet-expert.jpg" alt="alt" width={100} height={100} className='rounded-xl border border-gray-200' />
                    <div className='bg-[#F8FAFD] rounded-lg p-6 border border-gray-300'>
                        <h1 className='text-gray-700 font-semibold text-md mb-5'>Guillaume Peyronnet - The SEO Expert Guides You</h1>
                        <p className='text-gray-600 text-md'>Digital Brainstormer delivers a selection of innovative article ideas using AI in just minutes, providing comprehensive coverage on your chosen topic. Utilize it to continually enrich your site with fresh and relevant content</p>
                    </div>
                </div>

                <div className="flex justify-end w-full px-10">
                    <div className="flex items-center w-full">
                        <span className="text-gray-800 mr-3">Subject</span>

                        {/* Language Selector */}
                        <Menu>
                            <MenuButton className="text-white cursor-pointer">
                                <div className="flex items-center space-x-2 text-[#4A4291] hover:bg-[#4A4291] hover:text-white rounded-l-lg px-3 py-1.5 text-md font-medium border border-[#4A4291] focus:outline-none">
                                <span>Language</span>
                                <span>:</span>
                                {flagMap[selectedLanguage.gl]}
                                <IoIosArrowDown />
                                </div>
                            </MenuButton>
                            <MenuItems
                                anchor="bottom start"
                                className="[--anchor-gap:8px] [--anchor-padding:8px] rounded-md bg-white shadow-2xl p-4 px-6 space-y-4"
                            >
                                <MenuItem>
                                <div
                                    className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-32 cursor-pointer"
                                    onClick={() =>
                                    setSelectedLanguage({
                                        hl: 'en',
                                        gl: 'us',
                                        lr: 'lang_en',
                                        label: 'English (USA)',
                                    })
                                    }
                                >
                                    <US className="w-4 h-3" />
                                    <span>English</span>
                                    <span>(USA)</span>
                                </div>
                                </MenuItem>
                                <MenuItem>
                                <div
                                    className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-32 cursor-pointer"
                                    onClick={() =>
                                    setSelectedLanguage({
                                        hl: 'es',
                                        gl: 'us',
                                        lr: 'lang_es',
                                        label: 'Spanish (USA)',
                                    })
                                    }
                                >
                                    <FR className="w-4 h-3" />
                                    <span>French</span>
                                    <span>(France)</span>
                                </div>
                                </MenuItem>
                            </MenuItems>
                        </Menu>

                        {/* Textarea */}
                        <input
                            className="w-full h-9 px-4 py-1.5 border border-gray-300 text-gray-700 rounded-r-lg overflow-hidden focus:outline-none focus:ring-1 focus:ring-[#9770C8]"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        ></input>
                    </div>
                </div>


                <div className="flex items-center justify-end mt-2 px-10 pb-4">
                <button
                    className="bg-[#439B38] text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#198754] focus:outline-none"
                    onClick={handleGenerateBrainstormIdeas}
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Generate list of Articles'}
                </button>
                </div>
            </div>

            {history.length > 0 && (
                <div className="px-10 pb-6">
                    <h2 className="text-md font-semibold text-gray-700 mb-2">Previous searches</h2>

                    {history.map(h => (
                        <div key={h.id} className="border rounded-md p-3 my-2 bg-gray-50">
                            <div
                                className="cursor-pointer flex items-center justify-between"
                                onClick={() => setExpandedId(expandedId === h.id ? null : h.id)}
                            >
                                <span className="text-sm text-[#4A4291] font-medium">🇺🇸 {h.id}</span>
                                {expandedId === h.id &&
                                    expandedId === h.id ? (
                                        <FiMinus className=" bg-[#413793] text-white rounded-full w-4 h-4 p-0.5" />
                                    ) : (
                                        <FiPlus className="text-white bg-[#413793] rounded-full w-4 h-4 p-0.5"  />
                                    )}
                            </div>

                            {expandedId === h.id &&
                                <div>
                                    <div className='flex justify-end mt-4 text-gray-800'>
                                        <button
                                            className='bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded-xl cursor-pointer'
                                            onClick={() => exportCSV(h.id, h.query)}
                                        >
                                            Export(CSV)
                                        </button>
                                    </div>
                                    {results[h.id] && renderIdeasTable(results[h.id])}
                                </div>
                            }
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}