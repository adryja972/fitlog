import { Prisma } from "@prisma/client";
import Router from "next/router";
import { useState } from "react"
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap"
import Layout from "../components/Layout"
import ProgrammeModal from "../components/modals/ProgrammeModal"
import { FetchError } from "../lib/fetchJson"
import { ProgrammeService } from "../lib/services/programme.service"

type Props = {
  items: Array<Prisma.ProgrammeUncheckedUpdateManyInput>
}

export default function ProgrammesPage({ items }: Props) {
  const programmesExist : boolean = items.length > 0;
  
  const [addModalShow, addModalSetShow] = useState(false);
  const addModalHandleShow = () => addModalSetShow(true);
  const addModalHandleClose = () => addModalSetShow(false);
  const [addModalErrorMsg, addModalSetErrorMsg] = useState("");
  const addModalHandleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formBody = new FormData();
      formBody.append("file", selectedFile);
      formBody.append("folderName", "programmes");
      const fetchImage = await fetch("/api/images", {
        method: "POST",
        body: formBody
      });
      const uploadResult = await fetchImage.json();

      const res = await fetch('/api/programmes', {
        body: JSON.stringify({
          name: event.target.name.value,
          image: selectedFile.name
        }),
        headers: {'Content-Type': 'application/json'},
        method: 'POST'
      })
      const result = await res.json();
      addModalHandleClose();
      Router.push("/programmes");
    } catch (error) {
      if (error instanceof FetchError) {
        addModalSetErrorMsg(error.data.message);
      } else {
        console.error("An unexpected error happened:", error);
      }
    }
  }

  const [editModalShow, editModalSetShow] = useState(false);
  const [programmeData, setProgrammeData] = useState(null);
  const editModalHandleShow = (item: Prisma.ProgrammeUncheckedUpdateManyInput) => {
    setProgrammeData(item);
    editModalSetShow(true);
  }
  const editModalHandleClose = () => editModalSetShow(false);
  const [editModalErrorMsg, editModalSetErrorMsg] = useState("");
  const editModalHandleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formBody = new FormData();
      formBody.append("file", selectedFileEdit);
      formBody.append("folderName", "programmes");
      const fetchImage = await fetch("/api/images", {
        method: "POST",
        body: formBody
      });
      const uploadResult = await fetchImage.json();

      const res = await fetch(`/api/programmes/${event.target.muscleId.value}`, {
        body: JSON.stringify({
          id: event.target.muscleId.value,
          name: event.target.name.value,
          image: selectedFileEdit.name
        }),
        headers: {'Content-Type': 'application/json'},
        method: 'PUT'
      })
      const result = await res.json();
      editModalHandleClose();
      Router.push("/programmes");
    } catch (error) {
      if (error instanceof FetchError) {
        editModalSetErrorMsg(error.data.message);
      } else {
        console.error("An unexpected error happened:", error);
      }
    }
  }
  const handleDelete = async (programmeId: string) => {
    try {
      const res = await fetch(`/api/programmes/${programmeId}`, {
        body: JSON.stringify({
          id: programmeId
        }),
        headers: {'Content-Type': 'application/json'},
        method: 'DELETE'
      })
      const result = await res.json();
      Router.push("/programmes");
    } catch (error) {
      if (error instanceof FetchError) {
        editModalSetErrorMsg(error.data.message);
      } else {
        console.error("An unexpected error happened:", error);
      }
    }
  }

  // IMAGE HANDLER
  const [selectedFile, setSelectedFile] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const imageHandleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setSelectedFile(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const [selectedFileEdit, setSelectedFileEdit] = useState(null);
  const [createObjectURLEdit, setCreateObjectURLEdit] = useState(null);
  const imageHandleChangeEdit = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setSelectedFileEdit(i);
      setCreateObjectURLEdit(URL.createObjectURL(i));
    }
  };
  

  return (
    <Layout title="Programmes">
      <Container className="mt-3 fill-window" >
        { programmesExist ? (
          <>
            <Row xs={1} md={3} className="g-4">
              {items.map((item: Prisma.ProgrammeUncheckedUpdateManyInput, idx: Number) => (
                <Col key={idx.toString()}>
                  <Card style={{ width: '15rem' }}>
                    <Card.Img variant="top" src={"/images/programmes/" + item.image}/>
                    <Card.Body>
                      <Card.Title className="text-center">{item.name}</Card.Title>                      
                      <Button variant="danger" type="button" className="mx-1 float-end"
                        onClick={() => handleDelete(item.id.toString())}>
                        Supprimer
                      </Button>
                      <Button variant="primary" type="button" className="mx-1 float-end"
                        onClick={() => editModalHandleShow(item)}>
                        Modifier
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* <ListGroup>
              {items.map((item, index) => <ListGroup.Item key={index}>
                {item.name}
                <Button variant="danger" type="button" className="mx-1 float-end"
                  onClick={() => handleDelete(item.id)}>
                  Supprimer
                </Button>
                <Button variant="primary" type="button" className="mx-1 float-end"
                  onClick={() => editModalHandleShow(item)}>
                  Modifier
                </Button>
              </ListGroup.Item>)}
            </ListGroup> */}

            <ProgrammeModal
              show={editModalShow}
              handleClose={editModalHandleClose}
              errorMessage={editModalErrorMsg}
              onSubmit={editModalHandleSubmit}
              data={programmeData}

              imageURL={createObjectURLEdit}
              setImageURL={setCreateObjectURLEdit}
              handleImageChange={imageHandleChangeEdit}
            ></ProgrammeModal>
          </>
        ) : (
          <Container className="mt-3 fill-window" >
            <span>Créez de nouveaux programmes.</span>
          </Container>  
        )}
        <br/>
        <Button variant="primary" onClick={addModalHandleShow}>Ajouter un muscle</Button>
        <ProgrammeModal 
          show={addModalShow} 
          handleClose={addModalHandleClose} 
          errorMessage={addModalErrorMsg}
          onSubmit={addModalHandleSubmit}

          imageURL={createObjectURL}
          setImageURL={setCreateObjectURL}
          handleImageChange={imageHandleChange}
        ></ProgrammeModal>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps() {
  const ProgrammesService : ProgrammeService = new ProgrammeService();
  const data = await ProgrammesService.getProgrammes();
  let items : Array<Prisma.ProgrammeUncheckedUpdateManyInput> = []
  data.forEach((element) => {
    items.push({
      id: element.id,
      name: element.name,
      image: element.image,
    } as Prisma.ProgrammeUncheckedUpdateManyInput)
  });
  return {
    props: { items } 
  }
}
