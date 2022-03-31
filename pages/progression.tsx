import { Prisma } from "@prisma/client";
import { IronSessionData } from "iron-session";
import Router from "next/router";
import { useState } from "react"
import { Button, Container, ListGroup, Table } from "react-bootstrap"
import Layout from "../components/Layout"
import ProgressionModal from "../components/modals/ProgressionModal"
import { FetchError } from "../lib/fetchJson"
import { ExerciceService } from "../lib/services/exercice.service";
import { ProgressionService } from "../lib/services/progression.service"
import { withSessionSsr } from "../lib/withSession";

type Props = {
  items: Array<Prisma.ProgressionUncheckedUpdateManyInput>,
  exercices: Array<Prisma.ExerciceUncheckedUpdateManyInput>,
  user: IronSessionData
}

export default function ProgressionsPage({ items, exercices, user }: Props) {
  const progressionsExist : boolean = items.length > 0;
  
  const [addModalShow, addModalSetShow] = useState(false);
  const addModalHandleShow = () => addModalSetShow(true);
  const addModalHandleClose = () => addModalSetShow(false);
  const [addModalErrorMsg, addModalSetErrorMsg] = useState("");
  const addModalHandleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch('/api/progression', {
        body: JSON.stringify({
          date: event.target.name.date,
          poids: Number(event.target.poids.value),
          exerciceId: Number(event.target.exerciceId.value),
          userId: Number(event.target.userId.value)
        }),
        headers: {'Content-Type': 'application/json'},
        method: 'POST'
      })
      const result = await res.json();
      addModalHandleClose();
      Router.push("/progression");
    } catch (error) {
      if (error instanceof FetchError) {
        addModalSetErrorMsg(error.data.message);
      } else {
        console.error("An unexpected error happened:", error);
      }
    }
  }

  const [editModalShow, editModalSetShow] = useState(false);

  const [progressionData, setProgressionData] = useState(null);
  const editModalHandleShow = (item: Prisma.ProgressionUncheckedUpdateManyInput) => {
    setProgressionData(item);
    editModalSetShow(true);
  }

  const editModalHandleClose = () => editModalSetShow(false);
  const [editModalErrorMsg, editModalSetErrorMsg] = useState("");
  const editModalHandleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch(`/api/progression/${event.target.progressionId.value}`, {
        body: JSON.stringify({
          id: event.target.progressionId.value,
          date: event.target.name.date,
          poids: event.target.poids.value,
          exerciceId: event.target.exerciceId.value,
          userId: event.target.userId.value
        }),
        headers: {'Content-Type': 'application/json'},
        method: 'PUT'
      })
      const result = await res.json();
      editModalHandleClose();
      Router.push("/progression");
    } catch (error) {
      if (error instanceof FetchError) {
        editModalSetErrorMsg(error.data.message);
      } else {
        console.error("An unexpected error happened:", error);
      }
    }
  }

  const handleDelete = async (progressionId: string) => {
    try {
      const res = await fetch(`/api/progression/${progressionId}`, {
        body: JSON.stringify({
          id: progressionId
        }),
        headers: {'Content-Type': 'application/json'},
        method: 'DELETE'
      })
      const result = await res.json();
      Router.push("/progression");
    } catch (error) {
      if (error instanceof FetchError) {
        editModalSetErrorMsg(error.data.message);
      } else {
        console.error("An unexpected error happened:", error);
      }
    }
  }
  
  return (
    <Layout title="Progressions">
      <Container className="mt-3 fill-window" >
        { progressionsExist ? (
          <>
            {/* <ListGroup>
              {items.map((item, index) => <ListGroup.Item key={index}>
                {item.}
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

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Poids</th>
                  <th>Exercice</th>
                  <th>Utilisateur</th>
                  <th>Modifier</th>
                  <th>Supprimer</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => 
                  <tr key={index}>
                    <td>{item.date}</td>
                    <td>{item.poids}</td>
                    <td>{item.exerciceId}</td>
                    <td>{item.userId}</td>
                    <td>
                      <Button variant="primary" type="button" className="mx-1 float-end"
                        onClick={() => editModalHandleShow(item)}>
                        Modifier
                      </Button>
                    </td>
                    <td>
                      <Button variant="danger" type="button" className="mx-1 float-end"
                        onClick={() => handleDelete(item.id.toString())}>
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>

              <ProgressionModal
                show={editModalShow}
                handleClose={editModalHandleClose}
                errorMessage={editModalErrorMsg}
                onSubmit={editModalHandleSubmit}
                data={progressionData}
                exercices={exercices}
                user={user}
              ></ProgressionModal>

            </Table>

          </>
        ) : (
          <Container className="mt-3 fill-window" >
            <span>Ajoutez ici les progressions que vous souhaitez travailler.</span>
          </Container>  
        )}
        <br/>
        <Button variant="primary" onClick={addModalHandleShow}>Ajouter un progression</Button>
        <ProgressionModal 
          show={addModalShow} 
          handleClose={addModalHandleClose} 
          errorMessage={addModalErrorMsg}
          onSubmit={addModalHandleSubmit}
          exercices={exercices}
          user={user}
        ></ProgressionModal>
      </Container>
    </Layout>
  )
}

export const getServerSideProps = withSessionSsr(async function ({
  req,
  res,
}) {
  const ProgressionsService : ProgressionService = new ProgressionService();
  const data = await ProgressionsService.getProgressions();
  let items : Array<Prisma.ProgressionUncheckedUpdateManyInput> = []
  data.forEach((element) => {
    items.push({
      id: element.id,
      date: JSON.stringify(element.date),
      poids: element.poids,
      exerciceId: element.exerciceId,
      userId: element.userId
    } as Prisma.ProgressionUncheckedUpdateManyInput)
  });

  const exerciceService : ExerciceService = new ExerciceService();
  const exercices = await exerciceService.getExercices();

  const user = req.session;
  return {
    props: { items, exercices, user } 
  }
});

