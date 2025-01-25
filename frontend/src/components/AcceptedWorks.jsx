import React from 'react'
import PostList from './posts/PostList'

export default function AcceptedWorks() {
	return (
		<section>
			<PostList isAccepted={true} />
		</section>
	)
}
