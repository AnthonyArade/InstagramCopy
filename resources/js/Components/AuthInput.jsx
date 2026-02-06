import { useEffect, useRef, useState } from 'react';

export default function AuthInput({
    label,
    id,
    type = 'text',
    value = '',
    onChange,
    onFocus,
    onBlur,
    className = '',
    ...props
}) {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (props.autoFocus) {
            inputRef.current?.focus();
        }
    }, [props.autoFocus]);

    const hasValue = value?.toString().length > 0;

    return (
        <div className="relative pt-2">
            <input
                ref={inputRef}
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                onFocus={(e) => {
                    setIsFocused(true);
                    onFocus?.(e);
                }}
                onBlur={(e) => {
                    setIsFocused(false);
                    onBlur?.(e);
                }}
                className={`peer w-full rounded-lg border-2 border-gray-600 bg-gray-900 px-4 py-3 text-sm text-white transition placeholder-transparent focus:border-gray-400 focus:outline-none ${className}`}
                placeholder=" "
                {...props}
            />
            <label
                htmlFor={id}
                className={`absolute left-4 bg-gray-900 px-1 text-xs font-medium transition-all ${
                    isFocused || hasValue
                        ? '-top-2.5 text-gray-300'
                        : 'top-4 text-gray-500'
                }`}
            >
                {label}
            </label>
        </div>
    );
}
