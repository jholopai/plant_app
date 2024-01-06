import React from 'react'
import { Button, Card} from 'react-bootstrap';

type NoteProps = {
	date: Date;
	content: string;
  };

const Note=({date,content} : NoteProps)=>{
	const formattedDate = date instanceof Date ? date.toLocaleDateString('en-GB') : '';
	return(
		<Card className="note">
			<Card.Body>
				<Card.Title>{formattedDate}</Card.Title>
				<p>{content}</p>
			</Card.Body>
		</Card>
	)
}

export default Note;