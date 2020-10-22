import React from 'react'
import { Container } from 'react-bootstrap'

export default function Footer() {
  return(
    <footer>
      <Container className="text-center">
        <div className="small">&copy;{` Brocolli and Co. ${(new Date()).getFullYear()}. All Rights Reserved.`}</div>
      </Container>
  </footer>
  )
}