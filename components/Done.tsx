import React from 'react'
import { BsCheckSquare, BsXSquare } from "react-icons/bs";

type Props = {
  done: string
}

export default function Done({ done }: Props) {
  if(Boolean(done)) {
    return (
      <p>Faite <BsCheckSquare/></p>
    )
  } else {
    return (
      <p>Non faite <BsXSquare/></p>
    )
  }
}
