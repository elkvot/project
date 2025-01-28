import React from 'react'
import PostList from '../components/posts/PostList'

export default function Job() {
	return (
		<div className='mx-2 md:mx-0'>
			<PostList isAccepted={false}></PostList>
		</div>
	)
}
