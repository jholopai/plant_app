import {React, useState } from 'react'
import { Link } from 'react-router-dom'
import {Form, Button, Alert} from 'react-bootstrap'
import {SubmitHandler, useForm} from 'react-hook-form'

const Register = () => {

	const [show,setShow] = useState(false)
	const [isSuccesful, setIsSuccesful] = useState(true)
	const [serverResponse,setServerResponse] = useState("")

	interface FormData {
		email: string,
		username: string,
		password: string,
		confirmPassword: string
	}

	const {register, watch, handleSubmit, reset, formState:{errors}} = useForm<FormData>()

	const registration: SubmitHandler<FormData> = (data) => {
		
		const body = {
			username:data.username,
			email:data.email,
			password:data.password
		}

		const requestParameters = {
			method:"POST",
			headers:{'content-type':'application/json'},
			body:JSON.stringify(body)
		}

		fetch('/auth/register', requestParameters)
		.then(response => response.json())
		.then(data => {
			data.success ? setIsSuccesful(true) : setIsSuccesful(false)
			setServerResponse(data.message)
			setShow(true)
			reset()
		})
		.catch(error=>{
			setIsSuccesful(false)
			setServerResponse("An error occurred. Please try again.");
			setShow(true)
			console.log(error)})
	}

	return (
		<div className="container">
			{show?
			<>
			<Alert variant={isSuccesful?"success":"danger"} onClose={() => setShow(false)} dismissible>
				<p>
					{serverResponse}
				</p>
			</Alert>
			</>
			:null}
			<h1>Register</h1>
			<div className="form">
				<form onSubmit={handleSubmit(registration)}>
					<Form.Group className="form-group">
						<Form.Label>Username</Form.Label>
						<Form.Control type="text"
									  placeholder="Your username"
									  {...register("username", {required:true,
									  							minLength:5,
																maxLength:25,
																pattern: /[a-zA-Z0-9]*/})}/>
						{errors.username?.type=="required" && <span>Username is required.</span>}
						{(errors.username?.type=="minLength" || errors.username?.type === "maxLength") && <span>Username must be between 5 and 25 characters long.</span>}
						{errors.username?.type=="pattern" && <span>Username can only contain alphabeticals and numerals.</span>}
					</Form.Group>
					<Form.Group className="form-group">
						<Form.Label>Email</Form.Label>
						<Form.Control type="email"
									  placeholder="Your email"
									  {...register("email", {required:true,
															 minLength:6,
									  						 maxLength:60,
									 						 pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/})}/>
						{errors.email?.type=="required" && <span>Email is required.</span>}
						{(errors.email?.type=="minLength" || errors.email?.type === "maxLength") && <span>Email must be between 6 and 60 characters long.</span>}
						{errors.email?.type=="pattern" && <span>Email is not valid.</span>}
					</Form.Group>
					<Form.Group className="form-group">
						<Form.Label>Password</Form.Label>
						<Form.Control type="password"
									  placeholder="Your password"
									  {...register("password", {required:true,
																minLength:10,
										  						maxLength:25})}/>
						{errors.password?.type=="required" && <span>Password is required.</span>}
						{(errors.password?.type=="minLength" || errors.password?.type === "maxLength") && <span>Password must be between 10 and 25 characters long.</span>}
					</Form.Group>
					<Form.Group className="form.group">
						<Form.Label>Confirm password</Form.Label>
						<Form.Control type="password"
									  placeholder="Confirm password"
									  {...register("confirmPassword", {required:true,
																	   validate: (value) => value === watch("password") || "Passwords do not match."
																	   })}/>
						{errors.confirmPassword?.type=="required" && <span>Please confirm your password.</span>}
						{errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
					</Form.Group>
					<Form.Group>
						<Button className="submit-button" type="submit" variant="primary">Register</Button>
					</Form.Group>
					<Form.Group>
						<small>Already have an account? <Link to='/login'>You can log in here!</Link></small>
					</Form.Group>
				</form>
			</div>
		</div>
	)
}

export default Register;