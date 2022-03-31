import { Prisma } from "@prisma/client";
import { spawn } from "child_process";
import { useState } from "react";
import { Modal, Button, Form, Figure, Container, ListGroup } from "react-bootstrap";
import { ExerciceWithMuscles } from "../../lib/services/exercice.service";

type Props = {
  show?: any,
  handleClose?: any,
  errorMessage: string,
  onSubmit: any,
  data?: ExerciceWithMuscles,
  muscles?: Array<Prisma.MuscleUncheckedUpdateManyInput>,

  imageURL?: any,
  setImageURL?: any,
  handleImageChange?: any
}
 
export default function ExerciceModal(props: Props) {

  const [selectedFile, setSelectedFile] = useState(null);
  
  let musclesExist : boolean = false;
  if(props.data != null) {
    if(props.data.muscles.length > 0) {
      musclesExist = true;
    }
  } 

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Form onSubmit={props.onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Exercices</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            { props.data ? (
              <>
                <Form.Control defaultValue={props.data.id.toString()} id="exerciceId" name="exerciceId" type="text" hidden={true}/>
                <Form.Group className="mb-3">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control defaultValue={props.data.name.toString()} id="name" name="name" autoComplete="name" type="text" placeholder="Nom du exercice" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Image</Form.Label>
                  { selectedFile ? (
                    <Form.Control id="img" name="img" type="file" value={selectedFile} onChange={props.handleImageChange} placeholder="Image"/>
                  ) : (
                    <Form.Control id="img" name="img" type="file" value="" onChange={props.handleImageChange} placeholder="Image"/>
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Figure>
                    <Figure.Caption>
                      Aperçu :
                    </Figure.Caption>
                    <Figure.Image
                      width={171}
                      height={180}
                      alt="171x180"
                      src={props.imageURL}
                    />
                  </Figure>
                </Form.Group> 

                { props.muscles ? (
                  <>
                    { musclesExist ? ( 
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label>Muscles: </Form.Label>
                          <Form.Select id="muscleIds" name="muscleIds" autoComplete="muscleIds" placeholder="Muscles" multiple>
                            {props.muscles.map((muscle, index) => {

                              return props.data.muscles.find(element => element.id == muscle.id) ? ( 
                                <option key={index} selected value={muscle.id.toString()}>{muscle.name}</option>
                              ) : (
                                <option key={index} value={muscle.id.toString()}>{muscle.name}</option>
                              )

                            })}
                          </Form.Select>
                        </Form.Group>
                      </>
                    ) : (
                      <>
                        <Form.Group className="mb-3">
                        <Form.Label>Muscles: </Form.Label>
                          <Form.Select id="muscleIds" name="muscleIds" autoComplete="muscleIds" placeholder="Muscles" multiple>
                            {props.muscles.map((muscle, index) => 
                              <option key={index} value={muscle.id.toString()}>{muscle.name}</option>
                            )}
                          </Form.Select>
                        </Form.Group>
                      </>            
                    )}
                  </>
                ) : (
                  <>
                    <Container className="mt-3 fill-window" >
                      <span>Vous devez d'abord ajouter des muscles dans l'application</span>
                    </Container>
                  </>            
                )}
              </>
            ) : (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control id="name" name="name" autoComplete="name" type="text" placeholder="Nom du muscle" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Image</Form.Label>
                  { selectedFile ? (
                    <Form.Control id="img" name="img" type="file" value={selectedFile} onChange={props.handleImageChange} placeholder="Image"/>
                  ) : (
                    <Form.Control id="img" name="img" type="file" value="" onChange={props.handleImageChange} placeholder="Image"/>
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Figure>
                    <Figure.Caption>
                      Aperçu :
                    </Figure.Caption>
                    <Figure.Image
                      width={171}
                      height={180}
                      alt="171x180"
                      src={props.imageURL}
                    />
                  </Figure>
                </Form.Group> 

                <Form.Group className="mb-3">
                <Form.Label>Muscles: </Form.Label>
                  <Form.Select id="muscleIds" name="muscleIds" autoComplete="muscleIds" placeholder="Muscles" multiple>
                    {props.muscles.map((muscle, index) => 
                      <option key={index} value={muscle.id.toString()}>{muscle.name}</option>
                    )}
                  </Form.Select>
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
