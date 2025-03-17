import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { RxPencil1 } from "react-icons/rx";
import { PiCrownSimpleBold } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";
import { LuLink2 } from "react-icons/lu";
import { MdAutoGraph } from "react-icons/md";
import Image from "next/image";

const navigation = [
    { name: 'Dashboard', href: '#', current: true },
    { name: 'Team', href: '#', current: false },
    { name: 'Projects', href: '#', current: false },
    { name: 'Calendar', href: '#', current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Example() {
    return (
        <Disclosure as="nav" className="bg-[#413793]">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-20 items-center ">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button*/}
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <Image
                                src="/images/logo.png"
                                alt="Hero Image"
                                width={20} // Bigger size for a premium look
                                height={20}
                                className="h-10 w-auto"
                            />
                        </div>

                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-3">
                                <div className='flex items-center space-x-2 text-white hover:bg-[#4A4291] hover:text-white rounded-md px-3 py-2 text-md font-medium'>
                                    <RxPencil1/>
                                    <a
                                        key={'write_for_seo'}
                                        href='#'
                                        className=''
                                    >
                                        Write For SEO
                                    </a>
                                </div>
                                <Menu>
                                    <MenuButton className="text-white cursor-pointer">
                                        <div className='flex items-center space-x-2 text-white hover:bg-[#4A4291] hover:text-white rounded-md px-3 py-2 text-md font-medium'>
                                            <PiCrownSimpleBold />
                                            <a
                                                key={'write_for_seo'}
                                                href='#'
                                                className=''
                                            >
                                                Content Strategy
                                            </a>
                                            <IoIosArrowDown/>
                                        </div>
                                    </MenuButton>
                                    <MenuItems
                                        anchor="bottom start"
                                        className="[--anchor-gap:8px] [--anchor-padding:8px] rounded-md bg-white shadow-2xl"
                                    >
                                        <MenuItem>
                                            <span
                                                className="block px-7 pt-4 text-[0.65rem] text-blue-500 data-focus:outline-hidden"
                                            >
                                                FIND YOUR KEYWORDS
                                            </span>
                                        </MenuItem>
                                        <MenuItem>
                                            <a
                                                href="#"
                                                className="block px-7 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Keyword Explorer
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                        <a
                                                href="#"
                                                className="block px-7 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Keyword Cannibalization
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                        <a
                                                href="#"
                                                className="block px-7 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Content Gap
                                            </a>
                                        </MenuItem>

                                        <div className='px-4 text-gray-300'>
                                            <hr />
                                        </div>


                                        <MenuItem>
                                            <span
                                                className="block px-7 pt-4 text-[0.65rem] text-blue-500 data-focus:outline-hidden"
                                            >
                                                ANALYZE COMPETITORS
                                            </span>
                                        </MenuItem>
                                        <MenuItem>
                                            <a
                                                href="#"
                                                className="block px-7 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Website Rankings
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                        <a
                                                href="#"
                                                className="block px-7 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                SEO Keywords by URL
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                        <a
                                                href="#"
                                                className="block px-7 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                URLs Rankings
                                            </a>
                                        </MenuItem>

                                        <div className='px-4 text-gray-300'>
                                            <hr />
                                        </div>


                                        <MenuItem>
                                            <span
                                                className="block px-7 pt-4 text-[0.65rem] text-blue-500 data-focus:outline-hidden"
                                            >
                                                FIND CONTENT IDEAS
                                            </span>
                                        </MenuItem>
                                        <MenuItem>
                                            <a
                                                href="#"
                                                className="block px-7 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Digital Brainstormer
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                            <a
                                                href="#"
                                                className="block px-7 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Entities
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                            <a
                                                href="#"
                                                className="block px-7 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Questions
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                            <a
                                                href="#"
                                                className="block px-7 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Ideas
                                            </a>
                                        </MenuItem>

                                        <div className='px-4 text-gray-300'>
                                            <hr />
                                        </div>

                                        <MenuItem>
                                            <span
                                                className="block px-7 pt-4 text-[0.65rem] text-blue-500 data-focus:outline-hidden"
                                            >
                                                WRITE FOR SEO
                                            </span>
                                        </MenuItem>
                                        <MenuItem>
                                            <a
                                                href="#"
                                                className="block px-7 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Optimize Your Content
                                            </a>
                                        </MenuItem>

                                        <div className='px-4 text-gray-300'>
                                            <hr />
                                        </div>


                                        <MenuItem>
                                            <span
                                                className="block px-7 pt-4 text-[0.65rem] text-blue-500 data-focus:outline-hidden"
                                            >
                                                IMAGES
                                            </span>
                                        </MenuItem>
                                        <MenuItem>
                                            <a
                                                href="#"
                                                className="block px-7 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Get Images
                                            </a>
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>

                                <Menu>
                                    <MenuButton className="text-white cursor-pointer">
                                        <div className='flex items-center space-x-2 text-white hover:bg-[#4A4291] hover:text-white rounded-md px-3 py-2 text-md font-medium'>
                                            <LuLink2 />
                                            <a
                                                key={'write_for_seo'}
                                                href='#'
                                                className=''
                                            >
                                                Linking
                                            </a>
                                            <IoIosArrowDown/>
                                        </div>
                                    </MenuButton>
                                    <MenuItems
                                        anchor="bottom start"
                                        className="[--anchor-gap:8px] [--anchor-padding:8px] rounded-md bg-white border border-gray-500"
                                    >
                                        <MenuItem>
                                            <a
                                                href="#"
                                                className="block px-7 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Your Profile
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                            <a
                                                href="#"
                                                className="block px-7 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Your Profile
                                            </a>
                                        </MenuItem>
                                        <hr />
                                        <MenuItem>
                                        <a
                                                href="#"
                                                className="block px-7 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Your Profile
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                        <a
                                                href="#"
                                                className="block px-7 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Your Profile
                                            </a>
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>

                                <Menu>
                                    <MenuButton className="text-white cursor-pointer">
                                        <div className='flex items-center space-x-2 text-white hover:bg-[#4A4291] hover:text-white rounded-md px-3 py-2 text-md font-medium'>
                                            <MdAutoGraph />
                                            <a
                                                key={'write_for_seo'}
                                                href='#'
                                                className=''
                                            >
                                                Monitoring & Tech
                                            </a>
                                            <IoIosArrowDown/>
                                        </div>
                                    </MenuButton>
                                    <MenuItems
                                        anchor="bottom start"
                                        className="[--anchor-gap:8px] [--anchor-padding:8px] rounded-md bg-white border border-gray-500"
                                    >
                                        <MenuItem>
                                            <a
                                                href="#"
                                                className="block px-7 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Your Profile
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                            <a
                                                href="#"
                                                className="block px-7 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Your Profile
                                            </a>
                                        </MenuItem>
                                        <hr />
                                        <MenuItem>
                                        <a
                                                href="#"
                                                className="block px-7 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Your Profile
                                            </a>
                                        </MenuItem>
                                        <MenuItem>
                                        <a
                                                href="#"
                                                className="block px-7 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Your Profile
                                            </a>
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <button
                        type="button"
                        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                        >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon aria-hidden="true" className="size-6" />
                        </button>

                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3">
                        <div>
                            <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <img
                                alt=""
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                className="size-8 rounded-full"
                            />
                            </MenuButton>
                        </div>
                        <MenuItems
                            transition
                            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                        >
                            <MenuItem>
                            <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                            >
                                Your Profile
                            </a>
                            </MenuItem>
                            <MenuItem>
                            <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                            >
                                Settings
                            </a>
                            </MenuItem>
                            <MenuItem>
                            <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                            >
                                Sign out
                            </a>
                            </MenuItem>
                        </MenuItems>
                        </Menu>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                {navigation.map((item) => (
                    <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium',
                    )}
                    >
                    {item.name}
                    </DisclosureButton>
                ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    )
}