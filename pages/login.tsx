import React, { useState } from 'react'
import LoginForm from '../components/LoginForm';
import LoginLayout from '../components/LoginLayout';
import fetchJson, { FetchError } from '../lib/fetchJson';
import useUser from '../lib/useUser';

export default function Login() {
  const { mutateUser } = useUser({
    redirectTo: "/",
    redirectIfFound: true,
  });
  const [errorMsg, setErrorMsg] = useState("");
  
  return (
    <LoginLayout>
      <div className="login">
        <LoginForm
          errorMessage={errorMsg}
          onSubmit={async function handleSubmit(event) {
            event.preventDefault();

            const body = {
              username: event.currentTarget.username.value,
              password: event.currentTarget.password.value,
            };

            try {
              mutateUser(
                await fetchJson("/api/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(body),
                }),
              );
            } catch (error) {
              if (error instanceof FetchError) {
                setErrorMsg(error.data.message);
              } else {
                console.error("An unexpected error happened:", error);
              }
            }
          }}
        />
      </div>
    </LoginLayout>
  ); 
}
