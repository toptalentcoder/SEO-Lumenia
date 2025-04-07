'use client';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { IoIosArrowDown } from 'react-icons/io';
import { US, FR, DE, ZA, CH, AR, BE, CL, LU, AT, CO, MA, AE, AU, ES, IT, CA, MX, NL, EG, PE, PL, GB, AD, BR, IN, PT, RO } from 'country-flag-icons/react/3x2';

export default function LanguageMenu({ selectedLanguage, setSelectedLanguage }) {

    const flagMap = {
        us: <US />,
        fr: <FR />,
        de: <DE />,
        za: <ZA />,
        ch: <CH />,
        ar: <AR />,
        be: <BE />,
        cl: <CL />,
        lu: <LU />,
        at: <AT />,
        co: <CO />,
        ma: <MA />,
        ae: <AE />,
        au: <AU />,
        es: <ES />,
        it: <IT />,
        ca: <CA />,
        mx: <MX />,
        nl: <NL />,
        eg: <EG />,
        pe: <PE />,
        pl: <PL />,
        gb: <GB />,
        ad: <AD />,
        br: <BR />,
        in: <IN />,
        pt: <PT />,
        ro: <RO />
    };

    return (
        <div className="absolute left-1 top-0">
            <Menu>
                <MenuButton className="text-white cursor-pointer">
                    <div className="flex items-center space-x-2 text-[#4A4291] hover:bg-[#4A4291] hover:text-white rounded-l-lg px-3 py-3 text-md font-medium border border-[#4A4291]">
                        <span>Language</span>
                        <span>:</span>
                        {flagMap[selectedLanguage.gl]}
                        <span>{selectedLanguage.hl.toUpperCase()}</span>
                        <IoIosArrowDown />
                    </div>
                </MenuButton>
                <MenuItems
                    anchor="bottom start"
                    className="[--anchor-gap:8px] [--anchor-padding:8px] rounded-md bg-white shadow-2xl p-4 px-6 space-y-4"
                >
                    <MenuItem>
                        <div>
                            <span className="text-sm text-gray-400">Popular Language Choices</span>
                        </div>
                    </MenuItem>

                    <div className="flex items-center">
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({
                                    hl: 'en',
                                    gl: 'us',
                                    lr: 'lang_en',
                                    label: 'English (USA)'
                                })}
                            >
                                <US className="w-4 h-3" />
                                <span>English</span>
                                <span>(USA)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({
                                    hl: 'es',
                                    gl: 'us',
                                    lr: 'lang_es',
                                    label: 'Spanish (USA)'
                                })}
                            >
                                <US className="w-4 h-3" />
                                <span>Spanish</span>
                                <span>(USA)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({
                                    hl: 'fr',
                                    gl: 'fr',
                                    lr: 'lang_fr',
                                    label: 'French (France)'
                                })}
                            >
                                <FR className="w-4 h-3" />
                                <span>French</span>
                                <span>(France)</span>
                            </div>
                        </MenuItem>
                    </div>

                    <MenuItem>
                        <div>
                            <span className="text-sm text-gray-400">All available languages</span>
                        </div>
                    </MenuItem>

                    <div className="flex items-center">
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() =>
                                    setSelectedLanguage({
                                        hl: 'de',
                                        gl: 'at',
                                        lr: 'lang_de',
                                        label: 'German (Austria)',
                                    })
                                }
                            >
                                <AT className="w-4 h-3"/>
                                <span>German</span>
                                <span>(Austria)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() =>
                                    setSelectedLanguage({
                                        hl: 'en',
                                        gl: 'za',
                                        lr: 'lang_en',
                                        label: 'English (South Africa)',
                                    })
                                }
                            >
                                <ZA className="w-4 h-3"/>
                                <span>English</span>
                                <span>(South Africa)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() =>
                                    setSelectedLanguage({
                                        hl: 'fr',
                                        gl: 'ch',
                                        lr: 'lang_fr',
                                        label: 'French (Switzerland)',
                                    })
                                }
                            >
                                <CH className="w-4 h-3"/>
                                <span>French</span>
                                <span>(Switzerland)</span>
                            </div>
                        </MenuItem>
                    </div>

                    <div className="flex items-center">
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'de', gl: 'be', lr: 'lang_de', label: 'German (Belgium)' })}
                            >
                                <BE className="w-4 h-3"/>
                                <span>German</span>
                                <span>(Belgium)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'es', gl: 'ar', lr: 'lang_es', label: 'Spanish (Argentina)' })}
                            >
                                <AR className="w-4 h-3"/>
                                <span>Spanish</span>
                                <span>(Argentina)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({
                                    hl: 'fr',
                                    gl: 'fr',
                                    lr: 'lang_fr',
                                    label: 'French (France)'
                                })}
                            >
                                <FR className="w-4 h-3"/>
                                <span>French</span>
                                <span>(France)</span>
                            </div>
                        </MenuItem>
                    </div>

                    <div className="flex items-center">
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'de', gl: 'ch', lr: 'lang_de', label: 'German (Switzerland)' })}
                            >
                                <CH className="w-4 h-3"/>
                                <span>German</span>
                                <span>(Switzerland)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'es', gl: 'cl', lr: 'lang_es', label: 'Spanish (Chile)' })}
                            >
                                <CL className="w-4 h-3"/>
                                <span>Spanish</span>
                                <span>(Chile)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'fr', gl: 'lu', lr: 'lang_fr', label: 'French (Luxemburg)' })}
                            >
                                <LU className="w-4 h-3"/>
                                <span>French</span>
                                <span>(Luxemburg)</span>
                            </div>
                        </MenuItem>
                    </div>

                    <div className="flex items-center">
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'de', gl: 'de', lr: 'lang_de', label: 'German (Germany)' })}
                            >
                                <DE className="w-4 h-3"/>
                                <span>German</span>
                                <span>(Germany)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'es', gl: 'co', lr: 'lang_es', label: 'Spanish (Colombia)' })}
                            >
                                <CO className="w-4 h-3"/>
                                <span>Spanish</span>
                                <span>(Colombia)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'fr', gl: 'ma', lr: 'lang_fr', label: 'French (Morocco)' })}
                            >
                                <MA className="w-4 h-3"/>
                                <span>French</span>
                                <span>(Morocco)</span>
                            </div>
                        </MenuItem>
                    </div>

                    <div className="flex items-center">
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'en', gl: 'ae', lr: 'lang_en', label: 'English (UAE)' })}
                            >
                                <AE className="w-4 h-3"/>
                                <span>English</span>
                                <span>(United Arab Emirates)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'es', gl: 'us', lr: 'lang_es', label: 'Spanish (USA)' })}
                            >
                                <US className="w-4 h-3"/>
                                <span>Spanish</span>
                                <span>(USA)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'it', gl: 'ch', lr: 'lang_it', label: 'Italian (Switzerland)' })}
                            >
                                <CH className="w-4 h-3"/>
                                <span>Italian</span>
                                <span>(Switzerland)</span>
                            </div>
                        </MenuItem>
                    </div>

                    <div className="flex items-center">
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'en', gl: 'au', lr: 'lang_en', label: 'English (Australia)' })}
                            >
                                <AU className="w-4 h-3"/>
                                <span>English</span>
                                <span>(Australia)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'es', gl: 'es', lr: 'lang_es', label: 'Spanish (Spain)' })}
                            >
                                <ES className="w-4 h-3"/>
                                <span>Spanish</span>
                                <span>(Spain)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'it', gl: 'it', lr: 'lang_it', label: 'Italian (Italy)' })}
                            >
                                <IT className="w-4 h-3"/>
                                <span>Italian</span>
                                <span>(Italy)</span>
                            </div>
                        </MenuItem>
                    </div>

                    <div className="flex items-center">
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'en', gl: 'ca', lr: 'lang_en', label: 'English (Canada)' })}
                            >
                                <CA className="w-4 h-3"/>
                                <span>English</span>
                                <span>(Canada)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'es', gl: 'mx', lr: 'lang_es', label: 'Spanish (Mexico)' })}
                            >
                                <MX className="w-4 h-3"/>
                                <span>Spanish</span>
                                <span>(Mexico)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'nl', gl: 'nl', lr: 'lang_nl', label: 'Dutch (Netherlands)' })}
                            >
                                <NL className="w-4 h-3"/>
                                <span>Dutch</span>
                                <span>(Netherlands)</span>
                            </div>
                        </MenuItem>
                    </div>

                    <div className="flex items-center">
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'en', gl: 'eg', lr: 'lang_en', label: 'English (Egypt)' })}
                            >
                                <EG className="w-4 h-3"/>
                                <span>English</span>
                                <span>(Egypt)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'es', gl: 'pe', lr: 'lang_es', label: 'Spanish (Peru)' })}
                            >
                                <PE className="w-4 h-3"/>
                                <span>Spanish</span>
                                <span>(Peru)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'pl', gl: 'pl', lr: 'lang_pl', label: 'Polish (Poland)' })}
                            >
                                <PL className="w-4 h-3"/>
                                <span>Polish</span>
                                <span>(Poland)</span>
                            </div>
                        </MenuItem>
                    </div>

                    <div className="flex items-center">
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'en', gl: 'gb', lr: 'lang_en', label: 'English (UK)' })}
                            >
                                <GB className="w-4 h-3"/>
                                <span>English</span>
                                <span>(United Kingdom)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'fr', gl: 'ad', lr: 'lang_fr', label: 'French (Andorra)' })}
                            >
                                <AD className="w-4 h-3"/>
                                <span>French</span>
                                <span>(Andorra)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'pt', gl: 'br', lr: 'lang_pt', label: 'Portuguese (Brazil)' })}
                            >
                                <BR className="w-4 h-3"/>
                                <span>Portuguese</span>
                                <span>(Brazil)</span>
                            </div>
                        </MenuItem>
                    </div>

                    <div className="flex items-center">
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'en', gl: 'in', lr: 'lang_en', label: 'English (India)' })}
                            >
                                <IN className="w-4 h-3"/>
                                <span>English</span>
                                <span>(India)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'fr', gl: 'be', lr: 'lang_fr', label: 'French (Belgium)' })}
                            >
                                <BE className="w-4 h-3"/>
                                <span>French</span>
                                <span>(Belgium)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'pt', gl: 'pt', lr: 'lang_pt', label: 'Portuguese (Portugal)' })}
                            >
                                <PT className="w-4 h-3"/>
                                <span>Portuguese</span>
                                <span>(Portugal)</span>
                            </div>
                        </MenuItem>
                    </div>

                    <div className="flex items-center">
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'en', gl: 'us', lr: 'lang_en', label: 'English (USA)' })}
                            >
                                <US className="w-4 h-3"/>
                                <span>English</span>
                                <span>(USA)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'fr', gl: 'ca', lr: 'lang_fr', label: 'French (Canada)' })}
                            >
                                <CA className="w-4 h-3"/>
                                <span>French</span>
                                <span>(Canada)</span>
                            </div>
                        </MenuItem>
                        <MenuItem>
                            <div
                                className="flex items-center space-x-0.5 text-sm text-gray-500 font-semibold w-64 cursor-pointer"
                                onClick={() => setSelectedLanguage({ hl: 'ro', gl: 'ro', lr: 'lang_ro', label: 'Romanian (Romania)' })}
                            >
                                <RO className="w-4 h-3"/>
                                <span>Romanian</span>
                                <span>(Romania)</span>
                            </div>
                        </MenuItem>
                    </div>

                </MenuItems>
            </Menu>
        </div>
    );
}
