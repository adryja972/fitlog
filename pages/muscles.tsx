import Router from "next/router";
import { useState } from "react"
import { Prisma } from "@prisma/client";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap"
import Layout from "../components/Layout"
import MuscleModal from "../components/modals/MuscleModal"
import { FetchError } from "../lib/fetchJson"
import { MuscleService } from "../lib/services/muscle.service"

type Props = {
  items: Array<Prisma.MuscleUncheckedUpdateManyInput>
}

export default function MusclesPage({ items }: Props) {
  const musclesExist : boolean = items.length > 0;
  
  const [addModalShow, addModalSetShow] = useState(false);
  const addModalHandleShow = () => addModalSetShow(true);
  const addModalHandleClose = () => addModalSetShow(false);
  const [addModalErrorMsg, addModalSetErrorMsg] = useState("");
  const addModalHandleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formBody = new FormData();
      formBody.append("file", selectedFile);
      formBody.append("folderName", "muscles");
      const fetchImage = await fetch("/api/images", {
        method: "POST",
        body: formBody
      });
      const uploadResult = await fetchImage.json();
      
      const res = await fetch('/api/muscles', {
        body: JSON.stringify({
          name: event.target.name.value,
          image: selectedFile.name
        }),
        headers: {'Content-Type': 'application/json'},
        method: 'POST'
      })
      const result = await res.json();
      addModalHandleClose();
      Router.push("/muscles");
    } catch (error) {
      if (error instanceof FetchError) {
        addModalSetErrorMsg(error.data.message);
      } else {
        console.error("An unexpected error happened:", error);
      }
    }
  }

  const [editModalShow, editModalSetShow] = useState(false);
  const [muscleData, setMuscleData] = useState(null);
  const editModalHandleShow = (item: Prisma.MuscleUncheckedUpdateManyInput) => {
    setMuscleData(item);
    editModalSetShow(true);
  }
  const editModalHandleClose = () => editModalSetShow(false);
  const [editModalErrorMsg, editModalSetErrorMsg] = useState("");
  const editModalHandleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formBody = new FormData();
      formBody.append("file", selectedFileEdit);
      formBody.append("folderName", "muscles");
      const fetchImage = await fetch("/api/images", {
        method: "POST",
        body: formBody
      });
      const uploadResult = await fetchImage.json();

      const res = await fetch(`/api/muscles/${event.target.muscleId.value}`, {
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
      Router.push("/muscles");
    } catch (error) {
      if (error instanceof FetchError) {
        editModalSetErrorMsg(error.data.message);
      } else {
        console.error("An unexpected error happened:", error);
      }
    }
  }
  const handleDelete = async (muscleId: string) => {
    try {
      const res = await fetch(`/api/muscles/${muscleId}`, {
        body: JSON.stringify({
          id: muscleId
        }),
        headers: {'Content-Type': 'application/json'},
        method: 'DELETE'
      })
      const result = await res.json();
      Router.push("/muscles");
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
    <Layout title="Muscles">
      <Container className="mt-3">
        { musclesExist ? (
          <>
            <Row xs={1} md={3} className="g-4">
              {items.map((item: Prisma.MuscleUncheckedUpdateManyInput, idx: Number) => (
                <Col key={idx.toString()}>
                  <Card style={{ width: '15rem' }}>
                    <Card.Img variant="top" src={"/images/muscles/" + item.image}/>
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

            <MuscleModal
              show={editModalShow}
              handleClose={editModalHandleClose}
              errorMessage={editModalErrorMsg}
              onSubmit={editModalHandleSubmit}
              data={muscleData}

              imageURL={createObjectURLEdit}
              setImageURL={setCreateObjectURLEdit}
              handleImageChange={imageHandleChangeEdit}
            ></MuscleModal>

            {/* <ListGroup className="list-group">
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

          </>
        ) : (
          <Container className="mt-3 fill-window" >
            <span>Ajoutez ici les muscles que vous souhaitez travailler.</span>
          </Container>  
        )}

        <br/>
        <Button variant="primary" onClick={addModalHandleShow}>Ajouter un muscle</Button>
        <MuscleModal 
          show={addModalShow} 
          handleClose={addModalHandleClose} 
          errorMessage={addModalErrorMsg}
          onSubmit={addModalHandleSubmit}

          imageURL={createObjectURL}
          setImageURL={setCreateObjectURL}
          handleImageChange={imageHandleChange}

        ></MuscleModal>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps() {
  const MusclesService : MuscleService = new MuscleService();
  const data = await MusclesService.getMuscles();
  let items : Array<Prisma.MuscleUncheckedUpdateManyInput> = []
  data.forEach((element) => {
    items.push({
      id: element.id,
      name: element.name,
      image: element.image,
    } as Prisma.MuscleUncheckedUpdateManyInput)
  });
  return {
    props: { items } 
  }
}
