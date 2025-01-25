import React from 'react'

export default function BlueButton({children, otherClasses, ...props}) {
	return (
		<button className={"bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors " + otherClasses} {...props}>{children}</button>
	)
}
