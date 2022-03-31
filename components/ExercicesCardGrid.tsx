import { ReactNode } from 'react';
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap"

type ExerciceData = {
  id?: string,
  name?: string,
  image?: string,
  muscles?: [
    {
      id: string,
      name: string,
      image: string
    }
  ]
}

type Props = {
  children?: ReactNode,
  items: Array<ExerciceData>,
  onDelete: any,
  onEdit: any
}

export default function CardGrid(props : Props) {
  const cardsData: Array<ExerciceData> = [];
  props.items.map(exercice => cardsData.push(exercice));

  return (
    <>
      <h1>Exercices</h1>
      <p className="lead">Liste des exercices : </p>
      <Row xs={3} md={3} lg={3}>
      {Array.from({length: cardsData.length}).map((_, idx) => (
        <Col className="pb-4 mx-2" style={{ width: '18rem' }}>
          {/* <Card style={{ width: '18rem' }}> */}
          <Card>
            <Card.Img variant="top" src={cardsData[idx].image} />
            <Card.Body className="text-center">
              <Card.Title className="text-black">{cardsData[idx].name}</Card.Title>
              <Card.Text className="text-black">
                Muscles travaillés : 
                { cardsData[idx].muscles ? (
                  <>
                    <ListGroup>
                      {cardsData[idx].muscles.map((__, key) => 
                        <ListGroup.Item key={key}>
                          {cardsData[idx].muscles[key].name}
                        </ListGroup.Item>
                      )}
                    </ListGroup>
                  </>
                ) : (
                  <Container className="mt-3 fill-window" >
                    <span>Ajoutez ici les muscles travaillés par ses exercices.</span>
                  </Container>  
                )}
              </Card.Text>
              <Button variant="danger" type="button" className="mx-1 float-end"
                onClick={() => props.onDelete(cardsData[idx].id)}>
                Supprimer
              </Button>
              <Button variant="primary" type="button" className="mx-1 float-end"
                onClick={() => props.onEdit(cardsData[idx])}>
                Modifier
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
      </Row>
    </>
  )
}
