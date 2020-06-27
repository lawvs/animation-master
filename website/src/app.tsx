import React from 'react'
// https://www.styled-components.com/
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'

import { theme } from './theme'
import { Main } from './main'

const GlobalStyle = createGlobalStyle`
body {
  font-family: ${(props) => props.theme.typography.fontFamily};
  margin: 0;
}

a {
  color: inherit;
  text-decoration: none;
}
`

const AppContainer = styled.div`
  height: 100%;
  min-height: 100vh;
  width: 100vw;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${(props) => props.theme.background};
`

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: ${(props) => props.theme.maxWidth};
`

const Footer = styled(ContentWrapper)`
  flex: unset;
  padding-top: 40px;
  padding-bottom: 20px;
`

export const App = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <React.StrictMode>
          <AppContainer>
            <ContentWrapper>
              <Main />
            </ContentWrapper>
            <Footer as="footer">licensed under the MIT license.</Footer>
          </AppContainer>
        </React.StrictMode>
      </ThemeProvider>
    </>
  )
}
