import { React, useState, useEffect } from 'react'
import Note from './Note'
import {SubmitHandler, useForm} from 'react-hook-form'
import {Form, Button, Alert, Accordion} from 'react-bootstrap'

interface Plant {
	id: number;
	plant_name: string;
}

interface Note {
	id: number;
	date:Date;
	plant_name: string;
	content: string;
}

function getUsername() {
	const userData = localStorage.getItem('user');
	return userData ? JSON.parse(userData).username : null;
}

const PlantList = () => {

	const [plants, setPlants] = useState<Plant[]>([]);
	const [notes, setNotes] = useState<{ [plant_name: string]: Note[] }>({});
	const [username, setUsername] = useState(getUsername());
	const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

	useEffect(() => {
		if (!token) return

		const fetchNotes = async (plant_name : string) => {
			try {

				const requestParameters = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${JSON.parse(token)}`
					},
					body: JSON.stringify({ username, plant_name })
				};

				const response = await fetch('/notes_list', requestParameters);
				const data = await response.json();
				setNotes((prevNotes) => ({
					...prevNotes,
					[plant_name]: data.notes,
				  }));
			} catch (error) {
				console.log(error)
			}
		}

		const fetchPlants = async () => {
			try {
				const requestParameters = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${JSON.parse(token)}`
					},
					body: JSON.stringify({ username })
				};

				const response = await fetch('/plants_list', requestParameters);
				const data = await response.json();
				setPlants(data.plants);
				data.plants.forEach((plant: Plant) => {
					fetchNotes(plant.plant_name);
				  });
			} catch (error) {
				console.error(error);
			}
		};

		fetchPlants();
	}, [token, username]);

	return (
		<Accordion>
			{plants.map (
				(plant) => (
					<Accordion.Item eventKey={plant.id.toString()} key={plant.id}>
						<Accordion.Header>{plant.plant_name}</Accordion.Header>
						<Accordion.Body>
							{notes[plant.plant_name]?.map((note) => {
							const dateObject = new Date(note.date);
							return <Note date={dateObject} content={note.content} key={note.id} />;})}
						</Accordion.Body>
					</Accordion.Item>
				)
			)}
		 </Accordion>
	);
};

const PlantForm = () => {

	const [show,setShow] = useState(false)
	const [isSuccesful, setIsSuccesful] = useState(true)
	const [serverResponse,setServerResponse] = useState("")

	interface FormData {
		plant_name: string
	}

	const {register, handleSubmit, reset, formState:{errors}} = useForm<FormData>()

	const addPlant : SubmitHandler<FormData> = (data) => {

		const username = getUsername()

		const body = {
			plant_name:data.plant_name,
			username:username
		}
	
		const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY');

		if (token !== null) {
			const requestParameters = {
				method:"POST",
				headers:{'content-type':'application/json',
				'Authorization': `Bearer ${JSON.parse(token)}`},
				body:JSON.stringify(body)
			}
	
			fetch('/add_plant', requestParameters)
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
			.catch(error=>{
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
			<form onSubmit={handleSubmit(addPlant)}>
				<Form.Group className="form-group">
					<Form.Label>Name</Form.Label>
					<Form.Control  type="text"
							placeholder="e.g. Apple"
								{...register("plant_name", {required:true,
									  					  minLength:3,
														  maxLength:60,
														  pattern: /[a-zA-Z-]+/})}/>
						{errors.plant_name?.type=="required" && <span>Please enter the name of your plant.</span>}
						{(errors.plant_name?.type=="minLength" || errors.plant_name?.type === "maxLength") && <span>Name must be between 3 and 60 characters long.</span>}
						{errors.plant_name?.type=="pattern" && <span>Name can only contain alphabeticals and dashes (-).</span>}
				</Form.Group>
				<Form.Group className="submit-button">
					<Button type="submit" variant="primary">Add plant</Button>
				</Form.Group>
			</form>
			{show?
			<Alert variant={isSuccesful?"success":"danger"} onClose={() => setShow(false)} dismissible>
				<p>
					{serverResponse}
				</p>
			</Alert>
			:null}
		</div>
	)
}

const Plants = () => {
	return (
		<div className="container">
			<div className="row">
				<div className="col">
					<h3>Plants</h3>
					<PlantList/>
				</div>
				<div className="col">
					<div className="plant-form card card-body">
						<h3>Add a plant</h3>
						<PlantForm/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Plants;