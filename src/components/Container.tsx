import React, { ReactChildren } from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'
import MuiContainer from '@material-ui/core/Container'

export default function Container({ children }: { children: ReactChildren }) {
  return (
    <>
      <CssBaseline />
      <MuiContainer disableGutters>{children}</MuiContainer>
    </>
  )
}
