import { useState } from "react";

// DropdownMenu Component
export function DropdownMenu({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
        {children}
        {isOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white shadow-md rounded-md w-40">
            <div className="p-2">{children[1]}</div>
            </div>
        )}
        </div>
    );
}

// DropdownMenuTrigger Component
export function DropdownMenuTrigger({ children, className }) {
    return (
        <button
        className={`flex items-center gap-2 p-2 text-gray-900 rounded-md bg-transparent hover:bg-gray-100 ${className}`}
        >
        {children}
        </button>
    );
}

// DropdownMenuContent Component
export function DropdownMenuContent({ children, className }) {
    return (
        <div className={`bg-white text-black p-2 rounded-md shadow-md ${className}`}>
        {children}
        </div>
    );
}

// DropdownMenuItem Component
export function DropdownMenuItem({ children, className, onClick }) {
    return (
        <button
        onClick={onClick}
        className={`block text-gray-700 px-4 py-2 text-sm hover:bg-gray-100 ${className}`}
        >
        {children}
        </button>
    );
}
