import express from 'express'

export const launchStaticServer = ({
  port,
  directory,
}: {
  port: number
  directory: string
}) => {
  const app = express()

  app.use(express.static(directory))
  const server = app.listen(port)

  return server
}
