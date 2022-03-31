import { FormEvent } from "react";
import { Container, Button } from "react-bootstrap";
import Footer from "./Footer";
import { Form } from 'react-bootstrap'

export default function SignInForm({
  errorMessage,
  onSubmit,
}: {
  errorMessage: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Container className="mt-3 p-5">
      <Form method="post" onSubmit={onSubmit}>
        <h1 className="h3 mb-3 fw-normal">Veuillez vous connecter</h1>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Nom d'utilisateur</Form.Label>
          <Form.Control name="username" type="text" placeholder="Nom d'utilisateur" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control name="password" type="password" placeholder="Mot de passe" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Confirmer le mot de passe</Form.Label>
          <Form.Control name="passwordConfirm" type="password" placeholder="Confirmer le mot de passe" />
        </Form.Group>
        <Form.Group className="text-center mb-3" controlId="formBasicCheckbox">
          <Button variant="primary" type="submit">S'enregistrer</Button>
          {errorMessage && <p className="error">{errorMessage}</p>}
        </Form.Group>
      </Form>
    </Container>
  );
}
