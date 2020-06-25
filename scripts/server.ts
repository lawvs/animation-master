import * as express from 'express'

export const launchStaticServer = ({ port, directory }) => {
  const app = express()

  app.use(express.static(directory))
  const server = app.listen(port)

  return server
}
