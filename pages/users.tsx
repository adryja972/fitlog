import { GetStaticProps } from 'next'
import { Container, ListGroup } from 'react-bootstrap'
import Layout from '../components/Layout'
import { UserService } from '../lib/services/user.service'
import { User } from '@prisma/client';

export type UserSessionData = {
  id: string,
  name: string
}

type Props = {
  items: Array<UserSessionData>
}

export default function Users({ items }: Props) {
  return (
    <Layout title="Utilisateurs">
      <Container className="mt-3" title="Utilisateurs">
        <h1>Liste des utilisateurs</h1>
        <p>
          Voici l'ensemble des utilisateurs :
        </p>
        <ListGroup>
          {items.map(item => <ListGroup.Item key={item.id}>{item.name}</ListGroup.Item>)}
        </ListGroup>
      </Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const usersService : UserService = new UserService();
  const data = await usersService.getUsers();
  let items : Array<UserSessionData> = []
  data.forEach((element: User) => {
    items.push({
      id: String(element.id),
      name: element.username
    }) as unknown as UserSessionData
  });
  return {
    props: { items } 
  }
}
