import React, { ReactNode } from 'react'
import Head from 'next/head'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { useRouter } from 'next/router';
import Footer from './Footer';

type Props = {
  children?: ReactNode
  title?: string
}

export default function LoginLayout({ children, title = 'This is the default title' }: Props) {
  const location = useRouter();
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
            <Nav className="me-auto" activeKey={location.pathname}></Nav>
            <Nav>
              <Nav.Link eventKey={2} href="signin">S'enregistrer</Nav.Link>
              <Nav.Link eventKey={2} href="login">Connexion</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      <Container style={{height: "80vh"}}>
        {children}
      </Container>
      
      <Footer></Footer>
    </>
  )
}
