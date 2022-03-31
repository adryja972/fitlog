import { IronSessionData } from "iron-session";
import { Container } from "react-bootstrap"
import Layout from "../components/Layout"
import { withSessionSsr } from "../lib/withSession";

type Props = {
  user: IronSessionData
}

export default function IndexPage({user}: Props) {

  if ({user} === undefined) {
    return (
      <Layout title="Accueil">
        <Container className="mt-3">
          <h1>Bienvenue</h1>
          <p className="lead">L'application pour enregistrer ses séances de musculation.</p>
          <p className="lead">
            <a href="login" className="btn btn-lg btn-secondary fw-bold border-white bg-white">Log In</a>
          </p>
        </Container>
      </Layout>
    )
  } else {
    return (
      <Layout title="Accueil" user={user}>
        <Container className="mt-3">
          <h1>Bienvenue {user.username}</h1>
          <p className="lead">L'application pour enregistrer ses séances de musculation.</p>
          <p className="lead">
            <a href="login" className="btn btn-lg btn-secondary fw-bold border-white bg-white">Log In</a>
          </p>
        </Container>
      </Layout>
    )
  }
}

export const getServerSideProps = withSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session;
  if (user === undefined) {
    res.setHeader("location", "/login");
    res.statusCode = 302;
    res.end();
  }
  return {
    props: { user: req.session },
  };
});
