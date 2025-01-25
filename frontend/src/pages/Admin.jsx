import React from 'react'
import PostForm from '../components/posts/PostForm'
import AcceptedWorks from '../components/AcceptedWorks';

export default function Admin() {
	return (
		<div>
			<PostForm></PostForm>
			<AcceptedWorks></AcceptedWorks>
		</div>
	)
}
