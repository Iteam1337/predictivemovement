import { app } from './index'

app.listen(process.env.PORT || 9000, () =>
  console.info(`api listening at http://localhost:${process.env.PORT || 9000}`)
)
