import React, { useEffect } from 'react'
import PostList from '../components/posts/PostList'

export default function Job() {
	return (
		<div>
			<PostList isAccepted={false}></PostList>
		</div>
	)
}
