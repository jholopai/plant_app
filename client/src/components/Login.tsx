import React from 'react'
import { Link } from 'react-router-dom'
import {Form, Button} from 'react-bootstrap'
import {useForm, SubmitHandler} from 'react-hook-form'

const Login = () => {

	interface LoginData {
		username: string,
		password: string,
	}

	const {register, handleSubmit, formState:{errors}} = useForm<LoginData>()

	const login: SubmitHandler<LoginData>  = (data) => {
		console.log("Logged in!")
	}

	return (
		<div className="container">
			<h1>Login</h1>
			<div className="form">
				<form onSubmit={handleSubmit(login)}>
					<Form.Group>
						<Form.Label>Username</Form.Label>
						<Form.Control type="text"
									  {...register("username", {required:true})}/>
						{errors.username?.type === "required" && <span>Please provide a username.</span>}
					</Form.Group>
					<Form.Group>
						<Form.Label>Password</Form.Label>
						<Form.Control type="password"
									  {...register("password", {required:true})}/>
						{errors.password && <span>Please provide a password.</span>}
					</Form.Group>
					<Form.Group>
						<Button type="submit" variant="primary">Log in</Button>
					</Form.Group>
					<Form.Group>
						<small>Don't have an account? <Link to='/register'>You can register one here!</Link></small>
					</Form.Group>
				</form>
			</div>
		</div>
	)
}

export default Login;