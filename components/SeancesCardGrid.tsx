import Moment from 'react-moment';
import 'moment/locale/fr';
import { Card, Col, Container, Row } from "react-bootstrap"
import moment from 'moment';
import Done from './Done';

type SeanceData = {
  id?: string,
  dateh?: string,
  done?: string,
  programmeId?: string,
  programme?: {
    id: string,
    name: string
  }
}

type Props = {
  items: Array<SeanceData>
}

export default function CardGrid({ items }: Props) {
  const cardsData: Array<SeanceData> = [];
  items.map(seance => cardsData.push(seance));

  return (
    <>
      <h1>Seances</h1>
      <p className="lead">Les 9 dernières séances : </p>
      <Row xs={3} md={3} lg={3} >
      {Array.from({length: cardsData.length}).map((seance, idx) => (
        <Col className="pb-4">
          <Card >
            <Card.Body className="text-center">
              <Card.Title className="text-black">
                Seance {cardsData[idx].programme.name}
              </Card.Title>
              <Card.Text className="text-black">
                Le <Moment locale="fr" format="dddd Do MMMM YYYY [à] hh[h]mm">{ moment(cardsData[idx].dateh,'YYYY-MM-DD[T]HH:mm:ss.SSSZ') }</Moment>
                <Done done={cardsData[idx].done}></Done>
              </Card.Text>
            </Card.Body>
          </Card>
          {/* <br /> */}
        </Col>
      ))}
      </Row>
    </>
     
  )
}
