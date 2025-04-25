import React, { useState } from 'react';
import { FaGlobe, FaNewspaper, FaGamepad } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { MdSportsBasketball } from 'react-icons/md';
import { BiHealth } from 'react-icons/bi';
import { PiProhibitBold } from 'react-icons/pi';

const ModalSerpWeather = ({ isOpen, onClose, onSave }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLanguage, setSelectedLanguage] = useState('fr');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);

    if (!isOpen) return null;

    const categories = [
        { id: 'all', name: '🌐 All'},
        { id: 'news', name: '📰 News'},
        { id: 'adult', name: '🔞 Adult' },
        { id: 'games', name: '🎮 Games' },
        { id: 'health', name: '🩺 Health' },
        { id: 'sports', name: '⚽ Sports' },
        { id: 'finance', name: '💰 Finance' },
        { id: 'shopping', name: '🛒 Shopping' },
        { id: 'reference', name: '❓ Reference' },
        { id: 'realestate', name: '🏠 Real Estate' },
        { id: 'food_drink', name: '🍔 Food & Drink' },
        { id: 'home_garden', name: '🌱 Home & Garden' },
        { id: 'pets_animals', name: '🐱 Pets & Animals' },
        { id: 'autos_vehicles', name: '🚗 Autos & Vehicles' },
        { id: 'beauty_fitness', name: '💄 Beauty & Fitness' },
        { id: 'jobs_education', name: '🎓 Jobs & Education' },
        { id: 'law_government', name: '⚖️ Law & Government' },
        { id: 'people_society', name: '👥 People & Society' },
        { id: 'hobbies_leisure', name: '🧶 Hobbies & Leisure' },
        { id: 'books_literature', name: '📖 Books & Literature' },
        { id: 'internet_telecom', name: '🕸️ Internet & Telecom' },
        { id: 'online_communities', name: '📱 Online Communities' },
        { id: 'arts_entertainment', name: '🎨 Arts & Entertainment' },
        { id: 'business_industrial', name: '💼 Business & Industrial' },
        { id: 'computers_electronics', name: '💻 Computers & Electronics' },
        { id: 'travel_transportation', name: '🚢 Travel & Transportation' },
    ];

    const languages = [
        { id: 'fr', name: 'French (France)' },
        { id: 'en', name: 'English (USA)' },
    ];

    const handleClickOutside = () => {
        setIsCategoryOpen(false);
        setIsLanguageOpen(false);
    };

    const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
    const selectedLanguageData = languages.find(lang => lang.id === selectedLanguage);

    return (
        <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50" onClick={handleClickOutside}>
            <div className="bg-white rounded-xl w-full max-w-lg p-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-4">
                    <h2 className="text-md font-semibold">Settings SERP Weather</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
                        <IoClose size={24} />
                    </button>
                </div>

                <div className="space-y-2 w-1/2 justify-center items-center flex-col mx-auto">
                    {/* Category Dropdown */}
                    <div className="relative">
                        <div 
                            className="px-3 py-1.5 border border-gray-300 rounded-lg flex items-center justify-between cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsCategoryOpen(!isCategoryOpen);
                                setIsLanguageOpen(false);
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <span>{selectedCategoryData.name}</span>
                            </div>
                            <svg className={`w-4 h-4 text-gray-300 transform transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        
                        {isCategoryOpen && (
                            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-auto">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-sm"
                                        onClick={() => {
                                            setSelectedCategory(category.id);
                                            setIsCategoryOpen(false);
                                        }}
                                    >
                                        <span>{category.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Language Dropdown */}
                    <div className="relative">
                        <div 
                            className="px-3 py-1.5 border border-gray-300 rounded-lg flex items-center justify-between cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsLanguageOpen(!isLanguageOpen);
                                setIsCategoryOpen(false);
                            }}
                        >
                            <span>{selectedLanguageData.name}</span>
                            <svg className={`w-4 h-4 text-gray-300 transform transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {isLanguageOpen && (
                            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                {languages.map((language) => (
                                    <div
                                        key={language.id}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setSelectedLanguage(language.id);
                                            setIsLanguageOpen(false);
                                        }}
                                    >
                                        {language.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => {
                            onSave({ category: selectedCategory, language: selectedLanguage });
                            onClose();
                        }}
                        className="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalSerpWeather; 