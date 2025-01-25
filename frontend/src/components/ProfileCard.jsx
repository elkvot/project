import React from 'react'
import BlueButton from './UI/BlueButton'
import { Link } from 'react-router-dom'

export default function ProfileCard({ username, is_admin, phone, avatar, editable, taken_jobs, completed_jobs }) {
	return (
		<div className="max-w-md border-2 mx-auto m-7 p-3 bg-white rounded-lg shadow-md">
			<div className="mb-6 flex flex-col items-center">
				{avatar && (
					<div className=" flex flex-col items-center">
						<img
							src={`http://localhost:5000/${avatar}`}
							alt="Avatar"
							className="w-24 h-24 rounded-full object-cover"
						/>
					</div>
				)}
			</div>
			<h1 className="text-2xl font-semibold mb-4 text-center">{username}</h1>
			<div className="mb-4">
				<p className="text-lg"><span className="font-semibold">Телефон:</span> {phone}</p>
				{!is_admin ? <p><span className="font-semibold text-lg">Принято заказов: {taken_jobs}</span>{taken_jobs > 0 ?
					<span className='text-sm text-gray-400 ml-2'>({completed_jobs} из них выполнено)</span> : null} </p>
					: null}
				{editable ? <Link to='/updateprofile'><BlueButton otherClasses='mt-2'>Редактировать профиль</BlueButton></Link> : null}
			</div>
		</div>
	)
}
