import { Modal, Button, Form } from "react-bootstrap";
import moment from 'moment';
import { useState } from "react";
import { Prisma } from "@prisma/client";

type Props = {
  show?: any,
  handleClose?: any,
  errorMessage: string,
  onSubmit: any,
  data?: Prisma.SeanceUncheckedUpdateManyInput,
  programmes?: Array<Prisma.ProgrammeUncheckedUpdateManyInput>,
  user?: any
}
 
export default function SeanceModal(props: Props) {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));

  const [date2, setDate2] = props.data ? (
    useState(moment(props.data.date.toString()).format('YYYY-MM-DD'))
    ) : (
    useState(moment().format('YYYY-MM-DD'))
  )

  var programmesExist : boolean = false;
  if( props.programmes != undefined && props.programmes.length > 0 ) {
    programmesExist = true; 
  } 

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Form onSubmit={props.onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Séances</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            { props.data ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Control defaultValue={props.data.id.toString()} id="seanceId" name="seanceId" type="text" hidden={true}/>
                  <Form.Check defaultChecked={Boolean(props.data.done)} id="done" name="done" type="switch" label="Séance faite ?" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date :</Form.Label>
                  <Form.Control
                    type="date"
                    id="date"
                    name="date"
                    placeholder="Date :"
                    // value={moment(props.data.date.toString()).format('YYYY-MM-DD')}
                    value={date2}
                    onChange={(e) => setDate2(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Programme</Form.Label>
                  <Form.Control defaultValue={props.data.programmeId.toString()} id="programmeId" name="programmeId" autoComplete="programmeId" type="text" placeholder="Programme" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Utilisateur</Form.Label>
                  <Form.Control defaultValue={props.data.userId.toString()} id="userId" name="userId" autoComplete="userId" type="text" placeholder="Nom de l'utilisateur" />
                </Form.Group>
              </>
              ) : (
              <>
                <Form.Group className="mb-3">
                  <Form.Check id="done" name="done" type="switch" label="Séance faite ?" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date :</Form.Label>
                  <Form.Control
                    // type="datetime-local"
                    type="date"
                    id="date"
                    name="date"
                    placeholder="Date :"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />                  
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Programme</Form.Label>
                    { programmesExist ? (
                      <Form.Select id="programmeId" name="programmeId" autoComplete="programmeId" placeholder="Programme">
                        {props.programmes.map((programme, index) => 
                          <option key={index} value={programme.id.toString()}>{programme.name}</option>
                        )}
                      </Form.Select>
                    ) : (
                      <Form.Select disabled id="programmeId" name="programmeId" autoComplete="userId" placeholder="Nom de l'utilisateur">
                        <option>Programme</option>
                      </Form.Select>
                    )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Utilisateur</Form.Label>
                  <Form.Control  value={props.user.id} id="userId" name="userId" autoComplete="userId" type="text" placeholder="Nom de l'utilisateur" />
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
