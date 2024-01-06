import React from 'react'
import { useAuth, logout } from '../auth';
import { Link, useNavigate } from 'react-router-dom';

const Logout = () => {
	const navigate = useNavigate()
	return (
		<>
			<a className="btn btn-outline-secondary m-1" href="#" onClick={()=>{localStorage.clear();logout();navigate('/')}}>Logout</a>
		</>
)}

const LogInRegister = () => {
	return (
		<>
			<Link className="btn btn-outline-secondary m-1" to="/login">Login</Link>
			<Link className="btn btn-outline-secondary m-1" to="/register">Register</Link>
		</>
)}

const LoggedInLinks = () => {
	return (
		<>
			<li className="nav-item">
				<Link className="nav-link" to="/plants">Plants</Link>
			</li>
			<li className="nav-item">
				<Link className="nav-link" to="/calendar">Calendar</Link>
			</li>
		</>
)}

const Navbar = () => {

	const [logged]=useAuth();

	return (
		<nav className="navbar navbar-expand-lg bg-body-tertiary">
			<Link className="navbar-brand" to="/">The Plant App</Link>
			<button className="navbar-toggler" type="button" data-bs-toggle="collapse"
					data-bs-target="#navbarTogglerIcon" aria-controls="navbarTogglerIcon" aria-expanded="false"
					aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>
			<div className="collapse navbar-collapse" id="navbarToggler">
				<ul className="navbar-nav me-auto mb-2 mb-lg-0">
					<li className="nav-item">
						<Link className="nav-link" to="/">Home</Link>
					</li>
					{logged?<LoggedInLinks/>:null}
				</ul>
			</div>
			<div className="col-md-6 d-flex justify-content-end">
			{logged?<Logout/> : <LogInRegister/>}
			</div>
		</nav>
	)
}

export default Navbar;