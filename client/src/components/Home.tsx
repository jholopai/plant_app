import React from 'react'
import { useAuth } from '../auth'

const LoggedInHome = () => {
	return (
		<h1>Welcome back!</h1>
	)
}

const LoggedOutHome = () => {
	return (
		<div className="home">
			<h1>All your gardening notes in one place.</h1>
			<p>Track all of your plants' growth and well-being with one calendar.</p>
			<p>Taking note of both the challenges as well as the highlights of your growing
			   journey provides valuable information for future growing seasons to come.</p>
			<p>Sign up to get started.</p>
			<p>Happy gardening!</p>
		</div>
	)
}

const Home = () => {

	const [logged]=useAuth()

	return (
		<div>
			{logged?<LoggedInHome/> : <LoggedOutHome/>}
		</div>
	)
}

export default Home;