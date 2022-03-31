import moment from 'moment';
import { useState } from "react";
import { Prisma } from "@prisma/client";
import { Modal, Button, Form } from "react-bootstrap";

type Props = {
  show?: any,
  handleClose?: any,
  errorMessage: string,
  onSubmit: any,
  data?: Prisma.ProgressionUncheckedUpdateManyInput,
  exercices?: Array<Prisma.ExerciceUncheckedUpdateManyInput>,
  user?: any
}
 
export default function ProgressionModal(props: Props) {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  var exercicesExist : boolean = false;
  if( props.exercices != undefined && props.exercices.length > 0 ) {
    exercicesExist = true; 
  } 

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Form onSubmit={props.onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Progressions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            { props.data ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Control defaultValue={props.data.id.toString()} id="progressionId" name="progressionId" type="text" hidden={true}/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date :</Form.Label>
                  <Form.Control
                    type="switch"
                    id="date"
                    name="date"
                    placeholder="Date :"
                    value={moment(props.data.date.toString()).format('YYYY-MM-DD') }
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Poids</Form.Label>
                  <Form.Control defaultValue={props.data.poids.toString()} id="poids" name="poids" autoComplete="poids" type="number"/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Exercice</Form.Label>
                  <Form.Control defaultValue={props.data.exerciceId.toString()} id="exerciceId" name="exerciceId" autoComplete="exerciceId" type="text" placeholder="Programme" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Utilisateur</Form.Label>
                  <Form.Control defaultValue={props.data.userId.toString()} id="userId" name="userId" autoComplete="userId" type="text" placeholder="Nom de l'utilisateur" />
                </Form.Group>            
              </>
            ) : (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Date :</Form.Label>
                  <Form.Control
                    type="switch"
                    id="date"
                    name="date"
                    placeholder="Date :"
                    value={moment().format('YYYY-MM-DD') }
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Poids</Form.Label>
                  <Form.Control id="poids" name="poids" autoComplete="poids" type="number"/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Exercice</Form.Label>
                  { exercicesExist ? (
                    <Form.Select id="exerciceId" name="exerciceId" autoComplete="exerciceId" placeholder="Exercice">
                      {props.exercices.map((exercice, index) => 
                        <option key={index} value={exercice.id.toString()}>{exercice.name}</option>
                      )}
                    </Form.Select>
                  ) : (
                    <Form.Select disabled id="exerciceId" name="exerciceId" autoComplete="userId" placeholder="Nom de l'utilisateur">
                      <option>Exercice</option>
                    </Form.Select>
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Utilisateur</Form.Label>
                  <Form.Control value={props.user.id} id="userId" name="userId" autoComplete="userId" type="text" placeholder="Nom de l'utilisateur" />
                </Form.Group>   
              </>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Anuler
          </Button>
          <Button variant="primary" type="submit">
            Enregistrer
          </Button>
          {props.errorMessage && <p className="error">{props.errorMessage}</p>}
        </Modal.Footer>
      </Form>
    </Modal>
  );
} 
