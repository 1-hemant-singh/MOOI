import React, {useId} from 'react'

const Input = React.forwardRef( function Input({
    label,
    type = "text",
    className = "",
    ...props
}, ref){
    const id = useId()
    return (
        <div className='w-full'>
            {label && <label 
            className='inline-block mb-1 pl-1 text-sm font-medium text-lavender-purple-100' 
            htmlFor={id}>
                {label}
            </label>
            }
            <input
            type={type}
            className={`px-3 py-2 rounded-lg bg-indigo-ink-950/70 text-lavender-purple-50 placeholder:text-lavender-purple-300/60 outline-none duration-200 border border-lavender-purple-700/70 focus:border-mauve-magic-400 focus:ring-2 focus:ring-mauve-magic-500/30 w-full ${className}`}
            ref={ref}
            {...props}
            id={id}
            />
        </div>
    )
})

export default Input
