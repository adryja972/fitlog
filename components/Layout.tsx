import React, { ReactNode } from 'react'
import Head from 'next/head'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { useRouter } from 'next/router';
import useUser from '../lib/useUser';
import fetchJson from "../lib/fetchJson";
import { IronSessionData } from 'iron-session';
import Footer from './Footer';

type Props = {
  children?: ReactNode,
  title?: string,
  user?: IronSessionData
}

export default function Layout({ children, title = 'This is the default title', user = {
    id: '',
    username: ''
  } }: Props) {
  const location = useRouter();
  const { mutateUser } = useUser();

  if ({user} === undefined || Object.keys({user}.user).length === 0) {
    return (
      <>
        <Head>
          <title>{title}</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <meta name="description" content="header"></meta>
        </Head>
  
        <Navbar collapseOnSelect expand="lg" bg="light">
          <Container>
            <Navbar.Brand href="/">AppMuscu</Navbar.Brand>
            <Nav>
              <Nav.Link href="signin">S'enregistrer</Nav.Link>
              <Nav.Link href="/login">Connexion</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
  
        <Container style={{height: "80vh"}}>
          {children}
        </Container>

        <Footer></Footer>
      </>
    )
  } else {
    return (
      <>
        <Head>
          <title>{title}</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <meta name="description" content="header"></meta>
        </Head>
            
        <Navbar collapseOnSelect expand="lg" bg="light">
          <Container>
            <Navbar.Brand href="/">AppMuscu</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto" activeKey={location.pathname}>
                <Nav.Link href="/">Accueil</Nav.Link>
                <Nav.Link href="/muscles">Muscles</Nav.Link>
                <Nav.Link href="/exercices">Exercices</Nav.Link>
                <Nav.Link href="/programmes">Programmes</Nav.Link>
                <Nav.Link href="/seances">Séances</Nav.Link>
                <Nav.Link href="/progression">Progression</Nav.Link>
                <Nav.Link href="/users">Utilisateurs</Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link eventKey={2} onClick={async (e) => {
                    e.preventDefault();
                    mutateUser(
                      await fetchJson("/api/logout", { method: "POST" }),
                      false,
                    );
                    location.push("/login");
                  }}>Déconnexion</Nav.Link>
  
                {/* <NavDropdown title="User" id="collasible-nav-dropdown">
                  <NavDropdown.Item href="/login">Login</NavDropdown.Item>
                </NavDropdown> */}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
  
        <Container style={{minHeight: "80vh"}}>
          {children}
        </Container>

        <Footer></Footer>
      </>
    )
  }
}
