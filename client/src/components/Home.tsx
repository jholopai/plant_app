import {React, useState} from 'react'
import { useAuth } from '../auth'
import Accordion from 'react-bootstrap/Accordion';
import {Form, Button, Alert} from 'react-bootstrap'
import {useForm, SubmitHandler} from 'react-hook-form'

function getUsername() {
	const userData = localStorage.getItem('user');
	return userData ? JSON.parse(userData).username : null;
}

const ChangePasswordForm = () => {

	const username = getUsername();

	const [show,setShow] = useState(false)
	const [isSuccesful, setIsSuccesful] = useState(true)
	const [serverResponse,setServerResponse] = useState("")

	interface PasswordChgData {
		oldPassword: string,
		newPassword: string,
		confirmPassword: string
	}

	const {register, watch, reset, handleSubmit, formState:{errors}} = useForm<PasswordChgData>()

	const changePassword: SubmitHandler<PasswordChgData>  = (data) => {

		const body = {
			username:username,
			old_password:data.oldPassword,
			new_password:data.newPassword
		}

		const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

		if (token !== null) {
			const requestParameters = {
			  method: "POST",
			  headers: {
				'content-type': 'application/json',
				'Authorization': `Bearer ${JSON.parse(token)}`
			  },
			  body: JSON.stringify(body)
			};
			fetch('/auth/password', requestParameters)
			.then(response => {
				if (!response.ok) {
					throw new Error();
				}
				return response.json()})
			.then(data => {
				data.success ? setIsSuccesful(true) : setIsSuccesful(false)
				setServerResponse(data.message)
				setShow(true)
				reset()
			})
			.catch(error=> {
				setIsSuccesful(false)
				setServerResponse("An error occurred. Please try again.");
				setShow(true)
				console.log(error)})
		  } else {
			setIsSuccesful(false)
			setServerResponse("Something went wrong. Please try again later.");
			setShow(true)
		  }
	}

	return (
		<div>
		{show? 
			<Alert variant={isSuccesful?"success":"danger"} onClose={() => setShow(false)} dismissible>
			<p>
				{serverResponse}
			</p>
			</Alert>
		:null
		}
			<form onSubmit={handleSubmit(changePassword)}>
				<Form.Group>
					<Form.Label>Old password</Form.Label>
					<Form.Control type="password"
						  {...register("oldPassword", {required:true,
													   minLength:10,
													   maxLength:25})}/>
					{errors.oldPassword && <span>Please provide a valid password.</span>}
				</Form.Group>
				<Form.Group>
					<Form.Label>New password</Form.Label>
					<Form.Control type="password"
						  {...register("newPassword", {required:true,
													   minLength:10,
													   maxLength:25})}/>
					{errors.newPassword?.type=="required" && <span>Please provide new password.</span>}
					{(errors.newPassword?.type=="minLength" || errors.newPassword?.type === "maxLength") && <span>Password must be between 10 and 25 characters long.</span>}
				</Form.Group>
				<Form.Group>
					<Form.Label>Confirm password</Form.Label>
					<Form.Control type="password"
						  {...register("confirmPassword", {required:true,
													   minLength:10,
													   maxLength:25,
													   validate: (value) => value === watch("newPassword") || "Passwords do not match."})}/>
					{errors.confirmPassword && <span>Please provide a valid password.</span>}
				</Form.Group>
				<Form.Group>
					<Button type="submit" variant="primary">Change password</Button>
				</Form.Group>
			</form>
		</div>
	)
}

const LoggedInHome = () => {
	const username = getUsername();

	return (
		<div>
			<h1>Hi {username}!</h1>
			<Accordion>
				<Accordion.Item eventKey="0">
					<Accordion.Header>Change your password</Accordion.Header>
					<Accordion.Body>
						<ChangePasswordForm/>
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		</div>
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