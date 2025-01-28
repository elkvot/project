import React from 'react'
import PostForm from '../components/posts/PostForm'
import AcceptedWorks from '../components/AcceptedWorks';

export default function Admin() {
	return (
		<div className='mx-2 md:mx-0'>
			<PostForm></PostForm>
			<AcceptedWorks></AcceptedWorks>
		</div>
	)
}
