import { Prisma } from "@prisma/client";
import { useState } from "react";
import { Modal, Button, Form, Figure } from "react-bootstrap";

type Props = {
  show?: any,
  handleClose?: any,
  errorMessage: string,
  onSubmit: any,
  data?: Prisma.MuscleUncheckedUpdateManyInput,

  imageURL?: any,
  setImageURL?: any,
  handleImageChange?: any
}
 
export default function MuscleModal(props: Props) {

  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Form onSubmit={props.onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Muscles</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            { props.data ? (
              <>
                <Form.Control defaultValue={props.data.id.toString()} id="muscleId" name="muscleId" type="text" hidden={true}/>
                <Form.Label>Nom</Form.Label>
                <Form.Control defaultValue={props.data.name.toString()} id="name" name="name" autoComplete="name" type="text" placeholder="Nom du muscle" />
              </>
              ) : (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control id="name" name="name" autoComplete="name" type="text" placeholder="Nom du muscle" />
                </Form.Group>
              </>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control id="img" name="img" type="file" value={selectedFile} onChange={props.handleImageChange} placeholder="Image"/>
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
