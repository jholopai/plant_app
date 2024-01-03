import React from 'react'
import { login } from '../auth'
import { Link } from 'react-router-dom'
import {Form, Button} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import {useForm, SubmitHandler} from 'react-hook-form'

const Login = () => {

	interface LoginData {
		username: string,
		password: string,
	}

	const navigate = useNavigate()

	const {register, handleSubmit, formState:{errors}} = useForm<LoginData>()

	const loginUser: SubmitHandler<LoginData>  = (data) => {

		const body = {
			username:data.username,
			password:data.password
		}

		const requestParameters = {
			method:"POST",
			headers:{'content-type':'application/json'},
			body:JSON.stringify(body)
		}

		fetch('/auth/login', requestParameters)
		.then(response=>response.json())
		.then(data => {
			login(data.access_token)
			navigate('/')
		})
		.catch(error=>console.log(error))
	}

	return (
		<div className="container">
			<h1>Login</h1>
			<div className="form">
				<form onSubmit={handleSubmit(loginUser)}>
					<Form.Group>
						<Form.Label>Username</Form.Label>
						<Form.Control type="text"
									  {...register("username", {required:true,
																minLength:5,
																maxLength:25,
																pattern: /[a-zA-Z0-9]*/})}/>
						{errors.username && <span>Please provide a valid username.</span>}
					</Form.Group>
					<Form.Group>
						<Form.Label>Password</Form.Label>
						<Form.Control type="password"
									  {...register("password", {required:true,
																minLength:10,
																maxLength:25})}/>
						{errors.password && <span>Please provide a valid password.</span>}
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