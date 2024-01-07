import { React, useEffect } from "react";
import Home from './components/Home.tsx'
import Login from './components/Login.tsx';
import Navbar from './components/Navbar.tsx';
import Plants from './components/Plants.tsx';
import Calendar from './components/Calendar.tsx';
import Register from './components/Register.tsx';
import {
	Routes,
	Route, 
	useLocation
} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/styles.css';

function App() {

	const location = useLocation();

	useEffect(() => {
		const currentRoute = location.pathname;

		switch (currentRoute) {
			case '/':
				document.title = 'The Plant App - Home';
				break;
			case '/calendar':
				document.title = 'The Plant App - Calendar';
				break;
			case '/plants':
				document.title = 'The Plant App - Plants';
				break;
			case '/login':
				document.title = 'The Plant App - Login';
				break;
			case '/register':
				document.title = 'The Plant App - Register';
				break;
			default:
				document.title = 'The Plant App';
				break;
		}
	}, [location.pathname]);

	return (
			<div className="container-fluid">
				<Navbar/>
				<div className="page">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/calendar" element={<Calendar />} />
						<Route path="/plants" element={<Plants />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
					</Routes>
				</div>
			</div>
	);
}

export default App;
