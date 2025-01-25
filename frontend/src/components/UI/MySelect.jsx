import React from 'react'

export default function MySelect({ options, defaultValue, value, onChange, ...props }) {
	return (
		<select
		value={value}
		onChange={e => onChange(e.target.value)}
		{...props}
		>
			<option disabled={true} value="">{defaultValue}</option>
			{options.map(option => 
			<option key={option.value} value={option.value}>
				{option.name}
			</option>
			)}
		</select>
	)
}
