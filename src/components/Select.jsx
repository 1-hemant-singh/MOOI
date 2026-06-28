import React, {useId} from 'react'

function Select({
    options,
    label,
    className,
    ...props
}, ref) {
    const id = useId()
  return (
    <div className='w-full'>
        {label && <label htmlFor={id} className='inline-block mb-1 pl-1 text-sm font-medium text-lavender-purple-100'>{label}</label>}
        <select
        {...props}
        id={id}
        ref={ref}
        className={`px-3 py-2 rounded-lg bg-indigo-ink-950/70 text-lavender-purple-50 outline-none duration-200 border border-lavender-purple-700/70 focus:border-mauve-magic-400 focus:ring-2 focus:ring-mauve-magic-500/30 w-full ${className}`}
        >
            {options?.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
  )
}

export default React.forwardRef(Select)
