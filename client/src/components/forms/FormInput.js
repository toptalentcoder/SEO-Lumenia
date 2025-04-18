"use client";

import React from "react";

const FormInput = ({
    id,
    label,
    type,
    placeholder,
    value,
    onChange,
    className = "",
}) => {
    return (
        <div className="flex flex-col gap-y-2 sm:flex-row sm:items-center sm:gap-x-4 w-full">
            <label
                htmlFor={id}
                className="sm:w-1/3 text-sm font-medium text-gray-700"
            >
                {label}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                placeholder={placeholder}
                autoComplete={type === "password" ? "new-password" : "on"}
                value={value}
                onChange={onChange}
                className={`flex-grow px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:ring-blue-500 focus:border-blue-500 focus-visible:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${className}`}
                aria-label={label}
            />
        </div>
    );
};

export default FormInput;
