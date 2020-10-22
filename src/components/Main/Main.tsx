import React from 'react'
import { Button } from 'react-bootstrap'

export default function Main({ requestInvite }: any) {
  return (
    <>
      <main role="main" id="main" className="d-flex align-items-center justify-content-center" style={{ height: '95vh' }}>
        <div className="text-center">
          <h1>A better way to enjoy every day.</h1>
          <p>Be the first when we launch</p>
          <p>
            <Button onClick={requestInvite}>Request an invite</Button>
          </p>

        </div>
      </main>
    </>
  )
}
