
import React from 'react';

interface InputFieldProps {
    id: string;
    name: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    autoComplete?: string;
    required?: boolean;
    className?: string;
}

const InputField: React.FC<InputFieldProps> = ({ id, name, placeholder, ...props }) => {
    const baseClasses = "w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow";
    
    return (
        <div className='w-full max-w-sm min-w-[200px]'>
            <label htmlFor={id} className="sr-only">
                {placeholder}
            </label>
            <input id={id} name={name} {...props} className={`${baseClasses} ${props.className || ''}`} />
        </div>
    );
};

export default InputField;