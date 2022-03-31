import Router from "next/router";
import { useState } from "react"
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap"
import ExercicesCardGrid from "../components/ExercicesCardGrid"
import Layout from "../components/Layout"
import ExerciceModal from "../components/modals/ExerciceModal"
import { FetchError } from "../lib/fetchJson"
import { ExerciceService, ExerciceWithMuscles } from "../lib/services/exercice.service"
import { Muscle, Prisma } from "@prisma/client";
import { MuscleService } from "../lib/services/muscle.service";

// type Prisma.ExerciceUncheckedUpdateManyInput = {
//   id?: string,
//   name?: string,
//   image?: string,
//   exercices?: [
//     {
//       muscleId: string,
//       exerciceId: string,
//       muscle: {
//         id: string,
//         name: string
//       }
//     }
//   ]
// }

type Props = {
  items: Array<ExerciceWithMuscles>,
  muscles: Array<Prisma.MuscleUncheckedUpdateManyInput>
}

export default function ExercicesPage({ items, muscles }: Props) {
  const exercicesExist : boolean = items.length > 0;

  const [addModalShow, addModalSetShow] = useState(false);
  const addModalHandleShow = () => addModalSetShow(true);
  const addModalHandleClose = () => addModalSetShow(false);
  const [addModalErrorMsg, addModalSetErrorMsg] = useState("");
  const addModalHandleSubmit = async (event) => {
    event.preventDefault();
        
    let selectedMusclesValues : Array<any> = [];
    for (let index = 0; index < event.target.muscleIds.selectedOptions.length; index++) {
      // selectedMusclesValues.push(Number(event.target.muscleIds.selectedOptions[index].value));
      selectedMusclesValues.push({ id: Number(event.target.muscleIds.selectedOptions[index].value) });
    }    

    try {
      const formBody = new FormData();
      formBody.append("file", selectedFile);
      formBody.append("folderName", "exercices");
      const fetchImage = await fetch("/api/images", {
        method: "POST",
        body: formBody
      });
      const uploadResult = await fetchImage.json();

      const res = await fetch('/api/exercices', {
        body: JSON.stringify({
          name: event.target.name.value,
          image: selectedFile.name,
          muscles: {
            connect : selectedMusclesValues 
          }
        }),
        headers: {'Content-Type': 'application/json'},
        method: 'POST'
      })
      const result = await res.json();
      addModalHandleClose();
      Router.push("/exercices");
    } catch (error) {
      if (error instanceof FetchError) {
        addModalSetErrorMsg(error.data.message);
      } else {
        console.error("An unexpected error happened:", error);
      }
    }
  }

  const [editModalShow, editModalSetShow] = useState(false);
  const [exerciceData, setExerciceData] = useState(null);
  const editModalHandleShow = (item: ExerciceWithMuscles) => {
    setExerciceData(item);
    editModalSetShow(true);
  }
  const editModalHandleClose = () => editModalSetShow(false);
  const [editModalErrorMsg, editModalSetErrorMsg] = useState("");
  const editModalHandleSubmit = async (event) => {
    event.preventDefault();

    let selectedMusclesValues : Array<any> = [];
    for (let index = 0; index < event.target.muscleIds.selectedOptions.length; index++) {
      selectedMusclesValues.push({ id: Number(event.target.muscleIds.selectedOptions[index].value) });
    }      

    try {
      const formBody = new FormData();
      formBody.append("file", selectedFileEdit);
      formBody.append("folderName", "exercices");
      const fetchImage = await fetch("/api/images", {
        method: "POST",
        body: formBody
      });
      const uploadResult = await fetchImage.json();

      const res = await fetch(`/api/exercices/${event.target.exerciceId.value}`, {
        body: JSON.stringify({
          id: event.target.exerciceId.value,
          name: event.target.name.value,
          image: selectedFileEdit.name,
          muscles: {
            connect : selectedMusclesValues 
          }
        }),
        headers: {'Content-Type': 'application/json'},
        method: 'PUT'
      })
      const result = await res.json();
      editModalHandleClose();
      Router.push("/exercices");
    } catch (error) {
      if (error instanceof FetchError) {
        editModalSetErrorMsg(error.data.message);
      } else {
        console.error("An unexpected error happened:", error);
      }
    }
  }
  const handleDelete = async (exerciceId: string) => {
    try {
      const res = await fetch(`/api/exercices/${exerciceId}`, {
        body: JSON.stringify({
          id: exerciceId
        }),
        headers: {'Content-Type': 'application/json'},
        method: 'DELETE'
      })
      const result = await res.json();
      Router.push("/exercices");
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
    <Layout title="Exercices">
      <Container className="mt-3" >
        { exercicesExist ? (
          <>
            <Row xs={1} md={3} className="g-4">
              {items.map((item: ExerciceWithMuscles, idx: Number) => (
                <Col key={idx.toString()}>
                  <Card style={{ width: '15rem' }}>
                    <Card.Img variant="top" src={"/images/exercices/" + item.image}/>
                    <Card.Body>
                      <Card.Title className="text-center">{item.name}</Card.Title>

                      { item.muscles.length > 0 ? (
                        <>
                          <Card.Text>Muscles travaillés:</Card.Text> 
                          <Container className="mt-3 mb-3" >
                            <ListGroup>                    
                              {item.muscles.map((muscle: Muscle) => {
                                return <ListGroup.Item key={muscle.id}>{muscle.name}</ListGroup.Item>
                              })}
                            </ListGroup>
                          </Container>  
                        </>
                      ) : (
                        <>
                          <Container className="mt-3 fill-window" >
                            <span>Cet exercice n'est lié à aucun muscle</span>
                          </Container>  
                        </>
                      )}

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

            {/* <ExercicesCardGrid 
              items={items} 
              onDelete={handleDelete}
         w     onEdit={editModalHandleShow}
            >
            </ExercicesCardGrid> */}

            <ExerciceModal 
              show={editModalShow} 
              handleClose={editModalHandleClose} 
              errorMessage={editModalErrorMsg}
              onSubmit={editModalHandleSubmit}
              data={exerciceData}
              muscles={muscles}

              imageURL={createObjectURLEdit}
              setImageURL={setCreateObjectURLEdit}
              handleImageChange={imageHandleChangeEdit}
            ></ExerciceModal>
          </>

        ) : (
          <Container className="mt-3 fill-window" >
            <span>Ajoutez ici les exercices que vous souhaitez travailler.</span>
          </Container>  
        )}
        <br/>
        <Button variant="primary" onClick={addModalHandleShow}>Ajouter un exercice</Button>
        <ExerciceModal 
          show={addModalShow} 
          handleClose={addModalHandleClose} 
          errorMessage={addModalErrorMsg}
          onSubmit={addModalHandleSubmit}
          muscles={muscles}

          imageURL={createObjectURL}
          setImageURL={setCreateObjectURL}
          handleImageChange={imageHandleChange}

        ></ExerciceModal>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps() {
  const exercicesService : ExerciceService = new ExerciceService();
  const data = await exercicesService.getExercices();
  let items : Array<ExerciceWithMuscles> = [];
  data.forEach( async (element) => {
    items.push({
      id: element.id,
      name: element.name,
      image: element.image,
      muscles: element.muscles
    } as ExerciceWithMuscles)
  });

  const musclesService : MuscleService = new MuscleService();
  const muscles = await musclesService.getMuscles();

  return {
    props: { items, muscles } 
  }
}
