import { Button, Container, Table } from "react-bootstrap"
import SeancesCardGrid from "../components/SeancesCardGrid"
import Layout from "../components/Layout"
import { SeanceService } from "../lib/services/seance.service"
import { useState } from "react"
import { FetchError } from "../lib/fetchJson"
import Router from "next/router";
import SeanceModal from "../components/modals/SeancesModal"
import { Prisma } from "@prisma/client"
import { withSessionSsr } from "../lib/withSession"
import { ProgrammeService } from "../lib/services/programme.service"
import { IronSessionData } from "iron-session"
import moment from 'moment';

type Props = {
  items: Array<Prisma.SeanceUncheckedUpdateManyInput>,
  programmes: Array<Prisma.ProgrammeUncheckedUpdateManyInput>,
  user: IronSessionData
}

export default function SeancesPage({ items, programmes, user}: Props) {
  const seancesExist : boolean = items.length > 0;

  const [addModalShow, addModalSetShow] = useState(false);
  const addModalHandleShow = () => addModalSetShow(true);
  const addModalHandleClose = () => addModalSetShow(false);
  const [addModalErrorMsg, addModalSetErrorMsg] = useState("");
  const addModalHandleSubmit = async (event) => {
    event.preventDefault();
    try {
      let doneValue = 'false';
      if(event.target.done.value == 'on') {
        doneValue = 'true';
      } 

      const res = await fetch('/api/seances', {
        body: JSON.stringify({
          done: doneValue,
          date: moment(event.target.date.value),
          programmeId: Number(event.target.programmeId.value),
          userId: Number(event.target.userId.value)
        }),
        headers: {'Content-Type': 'application/json'},
        method: 'POST'
      })
      const result = await res.json();
      addModalHandleClose();
      Router.push("/seances");
    } catch (error) {
      if (error instanceof FetchError) {
        addModalSetErrorMsg(error.data.message);
      } else {
        console.error("An unexpected error happened:", error);
      }
    }
  }

  const [editModalShow, editModalSetShow] = useState(false);
  const [seanceData, setSeanceData] = useState(null);
  const editModalHandleShow = (item: Prisma.SeanceUncheckedUpdateManyInput) => {
    setSeanceData(item);
    editModalSetShow(true);
  }
  const editModalHandleClose = () => editModalSetShow(false);
  const [editModalErrorMsg, editModalSetErrorMsg] = useState("");
  const editModalHandleSubmit = async (event) => {
    event.preventDefault();
    try {
      let doneValue = 'false';
      if(event.target.done.value == 'on') {
        doneValue = 'true';
      } 

      const res = await fetch(`/api/seances/${event.target.seanceId.value}`, {
        body: JSON.stringify({
          id: event.target.seanceId.value,
          done: doneValue,
          date: moment(event.target.date.value),
          programmeId: Number(event.target.programmeId.value),
          userId: Number(event.target.userId.value)
        }),
        headers: {'Content-Type': 'application/json'},
        method: 'PUT'
      })
      const result = await res.json();
      editModalHandleClose();
      Router.push("/seances");
    } catch (error) {
      if (error instanceof FetchError) {
        editModalSetErrorMsg(error.data.message);
      } else {
        console.error("An unexpected error happened:", error);
      }
    }
  }
  const handleDelete = async (seanceId: string) => {
    try {
      const res = await fetch(`/api/seances/${seanceId}`, {
        body: JSON.stringify({
          id: seanceId
        }),
        headers: {'Content-Type': 'application/json'},
        method: 'DELETE'
      })
      const result = await res.json();
      Router.push("/seances");
    } catch (error) {
      if (error instanceof FetchError) {
        editModalSetErrorMsg(error.data.message);
      } else {
        console.error("An unexpected error happened:", error);
      }
    }
  }
  
  return (
    <Layout title="Seances">
      <Container className="mt-3">
        { seancesExist ? (
          <>
            {/* <SeancesCardGrid items={items}></SeancesCardGrid>  */}

            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Faite</th>
                  <th>Programme</th>
                  <th>Utilisateur</th>
                  <th>Modifier</th>
                  <th>Supprimer</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => 
                  <tr key={index}>
                    <td>{item.date}</td>
                    <td>{item.done}</td>
                    <td>{item.programmeId}</td>
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

              <SeanceModal
                show={editModalShow}
                handleClose={editModalHandleClose}
                errorMessage={editModalErrorMsg}
                onSubmit={editModalHandleSubmit}
                data={seanceData}
                programmes={programmes}
                user={user}
              ></SeanceModal>

            </Table>

          </>
        ) : (
          <Container className="mt-3">
            <span>Ajoutez ici les séances que vous souhaitez faire.</span>
          </Container>  
        )}

        <br/>
        <Button variant="primary" onClick={addModalHandleShow}>Ajouter un exercice</Button>
        <SeanceModal 
          show={addModalShow} 
          handleClose={addModalHandleClose} 
          errorMessage={addModalErrorMsg}
          onSubmit={addModalHandleSubmit}
          programmes={programmes}
          user={user}
        ></SeanceModal>
      </Container>
    </Layout>
  )
}

export const getServerSideProps = withSessionSsr(async function ({
  req,
  res,
}) {
  const seancesService : SeanceService = new SeanceService();
  const data = await seancesService.getSeances();
  let items : Array<Prisma.SeanceUncheckedUpdateManyInput> = []
  data.forEach((element) => {
    items.push({
      id: element.id,
      done: element.done,
      date: JSON.stringify(element.date),
      programmeId: element.programmeId,
      userId: element.userId
    } as Prisma.SeanceUncheckedUpdateManyInput)
  });

  const programmesService : ProgrammeService = new ProgrammeService();
  const programmes = await programmesService.getProgrammes();

  const user = req.session;
  return {
    props: { items, programmes, user } 
  }
});
