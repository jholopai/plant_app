import React from "react";
import Home from './components/Home.tsx'
import Login from './components/Login.tsx';
import Navbar from './components/Navbar.tsx';
import Plants from './components/Plants.tsx';
import Calendar from './components/Calendar.tsx';
import Register from './components/Register.tsx';
import {
	BrowserRouter,
	Routes,
	Route
} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
 
function App() { 
	return (
		<BrowserRouter>
			<div className="container-fluid">
				<Navbar/>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/calendar" element={<Calendar />} />
					<Route path="/plants" element={<Plants />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}
 
export default App;
