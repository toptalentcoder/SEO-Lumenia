"use client"

import Image from 'next/image';
import { useState, useEffect } from "react";
import { FaRobot } from "react-icons/fa6";
import axios from "axios";
import { useUser } from '../../../../context/UserContext';
import { useParams } from "next/navigation";
import { FiPlus, FiMinus } from "react-icons/fi";
import { FaTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { US, FR, DE, ZA, CH, AR, BE, CL, LU, AT, CO, MA, AE, AU, ES, IT, CA, MX, NL, EG, PE, PL, GB, AD, BR, IN, PT, RO } from 'country-flag-icons/react/3x2';
import { useRouter } from "next/navigation";

// Tone options
const toneOptions = [
    { label: "Friendly", emoji: "😊" },
    { label: "Professional", emoji: "💼" },
    { label: "Cheerful", emoji: "❤️" },
    { label: "Informative", emoji: "📘" },
    { label: "Inspirational", emoji: "🌟" },
    { label: "Casual", emoji: "👕" },
    { label: "Urgent", emoji: "⏰" },
    { label: "Motivational", emoji: "💪" },
    { label: "Humorous", emoji: "😂" },
    { label: "Empathetic", emoji: "🤗" },
    { label: "Concise", emoji: "✂️" },
    { label: "Sharp", emoji: "🔪" },
    { label: "Smart", emoji: "🧠" },
];

// Social Media options
const socialMediaOptions = [
    { label: "LinkedIn"},
    { label: "X" },
    { label: "Facebook" },
];

// Language options
const languageOptions = [
    { label: "English" },
    { label: "French" },
    { label: "Spanish" },
    { label: "Italian" },
    { label: "Portuguese" },
    { label: "Deutch" },
    { label: "German" },
    { label: "Romanian" },
];

export default function SocialPost({data}) {
    const [isToneOpen, setIsToneOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const [isSocialMediaOpen, setIsSocialMediaOpen] = useState(false);
    const [searchToneTerm, setSearchToneTerm] = useState("");
    const [searchLanguageTerm, setSearchLanguageTerm] = useState("");
    const [searchSocialTerm, setSearchSocialTerm] = useState("");
    const [selectedToneOption, setSelectedToneOption] = useState(toneOptions[0]);
    const [selectedLanguageOption, setSelectedLanguageOption] = useState(languageOptions[0]);
    const [selectedSocialMedia, setSelectedSocialMedia] = useState(socialMediaOptions[0]);
    const [isLoading, setIsLoading] = useState(false); // To handle loading state
    const [generatedPost, setGeneratedPost] = useState(""); // Store generated post
    const [seoEditorData, setSeoEditorData] = useState("");
    const { user } = useUser();
    const { queryID } = useParams();
    const [openIndex, setOpenIndex] = useState(); // Default first item open
    const router = useRouter();

    useEffect(() => {
        const fetchSeoEditorData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(
                    `/api/get_seo_editor_data?queryID=${queryID}&email=${user.email}`
                );

                if (response.data.success) {
                    setSeoEditorData(response.data.seoEditorData);
                }else(
                    setSeoEditorData("")
                )
            } catch (error) {
                setSeoEditorData("")
            } finally {
                setIsLoading(false);
            }
        };

        fetchSeoEditorData();
    }, [queryID, user.email]);

    // Handle dropdown toggle
    const handleToneToggleDropdown = () => setIsToneOpen(!isToneOpen);
    const handleLanguageToggleDropdown = () => setIsLanguageOpen(!isLanguageOpen);
    const handleSocialMediaToggleDropdown = () => setIsSocialMediaOpen(!isSocialMediaOpen);

    // Handle search change
    const handleToneSearchChange = (e) => setSearchToneTerm(e.target.value);
    const handleLanguageSearchChange = (e) => setSearchLanguageTerm(e.target.value);
    const handleSocialMediaSearchChange = (e) => setSearchSocialTerm(e.target.value);

    // Handle select option
    const handleToneSelectOption = (option) => {
        setSelectedToneOption(option);
        setIsToneOpen(false);
    };
    const handleLanguageSelectOption = (option) => {
        setSelectedLanguageOption(option);
        setIsLanguageOpen(false);
    };
    const handleSocialMediaSelectOption = (option) => {
        setSelectedSocialMedia(option);
        setIsSocialMediaOpen(false);
    };

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    // Filter options based on search
    const filteredToneOptions = toneOptions.filter((option) =>
        option.label.toLowerCase().includes(searchToneTerm.toLowerCase())
    );
    const filteredLanguageOptions = languageOptions.filter((option) =>
        option.label.toLowerCase().includes(searchLanguageTerm.toLowerCase())
    );
    const filteredSocialMediaOptions = socialMediaOptions.filter((option) =>
        option.label.toLowerCase().includes(searchSocialTerm.toLowerCase())
    );

    // Handle the generate button click
    const handleGenerateClick = async () => {
        if(seoEditorData === ""){
            alert("Please fill the SEO Editor before generating a post.");
            return;
        }
        if(selectedSocialMedia === ""){
            alert("Please select a social media platform.");
            return;
        }
        if(selectedToneOption === ""){
            alert("Please select a tone.");
            return;
        }
        setIsLoading(true); // Show loading spinner

        const requestData = {
            query: data.query, // Replace with actual query, maybe from the state
            tone: selectedToneOption.label.toLowerCase(),
            platform: selectedSocialMedia.label.toLowerCase(),
            content: seoEditorData, // Replace with actual content
            queryID : queryID,
            email : user.email
        };

        try {
            const response = await axios.post("/api/create_social_post", requestData);
            if (response.data.success) {
                setGeneratedPost(response.data.socialPost); // Store generated post
                await fetchSocialPostData();
            } else {
                console.error("Error generating social post", response.data.error);
            }
        } catch (error) {
            console.error("Error generating social post:", error);
        } finally {
            setIsLoading(false); // Hide loading spinner
        }
    };

    const fetchSocialPostData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/api/get_social_post?queryID=${queryID}&email=${user.email}`
            );

            console.log(response.data.socialPostData)
            if (response.data.success) {
                setGeneratedPost(response.data.socialPostData);
            }else{
                setGeneratedPost([]);
            }
        } catch (error) {
            setGeneratedPost([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSocialPostData();
    }, [queryID, user.email]);

    return (
        <div className="px-14">
            <div className="flex items-center space-x-8">
                <Image src="/avatar.png" alt="alt" width={125} height={125} className='rounded-xl' />
                <div className='bg-gray-50 rounded-xl border border-gray-300 py-4 px-4'>
                    <div className='flex-shrink-0 font-semibold text-gray-700'>Sylvain Peyronnet - The SEO Expert Guides You</div>
                    <div className='flex-shrink-0 mt-5 text-gray-700'>
                        To help you promote your content, ask AI to generate a post for the main social media platforms. Then all you have to do is post it!
                    </div>
                </div>
            </div>

            <div className='mt-10 flex items-center space-x-4  border-b border-gray-300 pb-10'>

                {/* Social Media Dropdown */}
                <div className="relative inline-block w-52">
                    <div className='text-gray-600 text-sm mb-2'>Social Media</div>
                    <button
                        onClick={handleSocialMediaToggleDropdown}
                        className='w-full px-4 py-1 text-left bg-white border border-[#4A4291] rounded-lg text-gray-700'
                    >
                        {selectedSocialMedia.label}
                    </button>

                    {isSocialMediaOpen && (
                        <div className="absolute w-full mt-2 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                            <input
                                type="text"
                                value={searchSocialTerm}
                                onChange={handleSocialMediaSearchChange}
                                placeholder="Search..."
                                className=" w-44 px-4 py-1 mx-3 my-2 text-sm border rounded-lg focus:outline-none border-gray-300"
                            />
                            <div className="max-h-52 overflow-y-auto">
                                {filteredSocialMediaOptions.length === 0 ? (
                                    <div className="px-4 py-2 text-gray-500">No results</div>
                                ) : (
                                    filteredSocialMediaOptions.map((option) => (
                                        <div
                                            key={option.label}
                                            onClick={() => handleSocialMediaSelectOption(option)}
                                            className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 text-black"
                                        >
                                            {option.label}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Tone Dropdown */}
                <div className="relative inline-block w-52">
                    <div className='text-gray-600 text-sm mb-2'>Tone</div>
                    <button
                        onClick={handleToneToggleDropdown}
                        className='w-full px-4 py-1 text-left bg-white border border-[#4A4291] rounded-lg text-gray-700'
                    >
                        <span className='mr-2'>{selectedToneOption.emoji}</span>
                        {selectedToneOption.label}
                    </button>

                    {isToneOpen && (
                        <div className="absolute w-full mt-2 bg-white border rounded-md shadow-lg max-h-92 overflow-y-auto">
                            <input
                                type="text"
                                value={searchToneTerm}
                                onChange={handleToneSearchChange}
                                placeholder="Search..."
                                className=" w-44 px-4 py-1 mx-3 my-2 text-sm border rounded-lg focus:outline-none border-gray-300"
                            />
                            <div className="max-h-52 overflow-y-auto">
                                {filteredToneOptions.length === 0 ? (
                                    <div className="px-4 py-2 text-gray-500">No results</div>
                                ) : (
                                    filteredToneOptions.map((option) => (
                                        <div
                                            key={option.label}
                                            onClick={() => handleToneSelectOption(option)}
                                            className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 text-black"
                                        >
                                            <span className="mr-2">{option.emoji}</span>
                                            {option.label}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Language Dropdown */}
                <div className="relative inline-block w-52">
                    <div className='text-gray-600 text-sm mb-2'>Language</div>
                    <button
                        onClick={handleLanguageToggleDropdown}
                        className='w-full px-4 py-1 text-left bg-white border border-[#4A4291] rounded-lg text-gray-700'
                    >
                        {selectedLanguageOption.label}
                    </button>

                    {isLanguageOpen && (
                        <div className="absolute w-full mt-2 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                            <input
                                type="text"
                                value={searchLanguageTerm}
                                onChange={handleLanguageSearchChange}
                                placeholder="Search..."
                                className=" w-40 px-4 py-1 mx-3 my-2 text-sm border rounded-lg focus:outline-none border-gray-300 text-gray-700"
                            />
                            <div className="max-h-52">
                                {filteredLanguageOptions.length === 0 ? (
                                    <div className="px-4 py-2 text-gray-500">No results</div>
                                ) : (
                                    filteredLanguageOptions.map((option) => (
                                        <div
                                            key={option.label}
                                            onClick={() => handleLanguageSelectOption(option)}
                                            className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200 text-black"
                                        >
                                            {option.label}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative group">
                    <div className="text-gray-600 text-sm mb-2 invisible">Generate</div>
                    <button
                        onClick={handleGenerateClick} // Trigger the post request
                        className="bg-[#439B38] rounded-xl px-5 py-2 text-white text-sm"
                        disabled={isLoading} // Disable the button when loading
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-4 border-t-4 border-white rounded-full animate-spin"></div>
                        ) : (
                            "Generate"
                        )}
                    </button>

                    {/* Tooltip */}
                    <div className="absolute top-1/2 left-full ml-3 mt-3 transform -translate-y-1/2 bg-[#4A4291] text-white text-xs px-3 py-1.5 rounded-lg shadow-lg flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {/* Triangle Pointer */}
                        <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-r-6 border-r-[#4A4291]"></div>

                        {/* Tooltip Text */}
                        <span className="font-semibold">Total</span>
                        <span className="font-semibold">cost</span>
                        <span className="font-semibold">:</span>
                        <span className="font-semibold">600</span>
                        <span><FaRobot/></span>
                    </div>
                </div>
            </div>

            <div id="faq" className=" mt-3 text-center w-full cursor-pointer">
                    <div className="max-w-5xl mx-auto space-y-4 ">
                        {Array.isArray(generatedPost) &&
                            generatedPost.map((faq, index) => (
                                <div key={index} className="bg-white px-5 py-3 transition-all border-b border-gray-300 ">
                                    <div className='flex justify-between'>
                                        <button
                                            className="w-full flex items-center text-left text-lg font-semibold text-gray-600"
                                            onClick={() => toggleFAQ(index)}
                                        >
                                            <div className='ml-3 mr-1'><US className='w-4 h-4'/></div>
                                            <span>-</span>
                                            <div>
                                                {faq.socialMedia === "linkedin" ? <FaLinkedin className='w-4 h-4 ml-1'/> : null}
                                                {faq.socialMedia === "facebook" ? <FaFacebook className='w-4 h-4 ml-1'/> : null}
                                                {faq.socialMedia === "x" ? <FaTwitter className='w-4 h-4 ml-1'/> : null}
                                            </div>
                                            <div className="ml-1 text-sm">{faq.socialMedia === "x" ? "twitter" : faq.socialMedia}</div>
                                            <span>-</span>
                                            <div>
                                                {toneOptions.map((option) => (
                                                    <div key={option.label} className="flex items-center">
                                                        {option.label.toLowerCase() === faq.tone ? (
                                                            <>
                                                                <span className="text-[#439B38] text-sm">{option.emoji}</span>
                                                                <span className='text-sm'>{option.label}</span>  {/* Show the label of the tone */}
                                                            </>
                                                        ) : null}
                                                    </div>
                                                ))}
                                            </div>
                                        </button>
                                        {openIndex === index ? (
                                            <FiMinus className=" bg-[#413793] text-white rounded-full w-4 h-4 p-0.5" />
                                        ) : (
                                            <FiPlus className="text-white bg-[#413793] rounded-full w-4 h-4 p-0.5"  />
                                        )}
                                    </div>

                                    <div className="ml-7">
                                        {openIndex === index && faq.text && (
                                            <p className="mt-2 text-gray-600 text-left">{faq.text}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
        </div>
    );
}