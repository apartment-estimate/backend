import cors from 'cors'
import express from 'express'
import { db } from './db.js'// eslint-disable-line no-unused-vars
import { corsOptions, JWT_SIGN } from './config.js'// eslint-disable-line no-unused-vars
import path from 'path'// eslint-disable-line no-unused-vars
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import passport from 'passport'// eslint-disable-line no-unused-vars
import expressSession from 'express-session'// eslint-disable-line no-unused-vars

import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'

import routerMaterials from './routes/materials.js'

const port = process.env.PORT || 3001

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Apartment Estimation Backend API',
      version: '1.0.0',
      description: 'ver 0.2.0'
    },
    servers: [
      {
        url: `http://62.113.99.170:${port}`
      }
    ]
  },
  apis: ['./routes/*.js']
}

const specs = swaggerJsDoc(options)

const app = express()

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))

// app.use(cors(corsOptions))
app.use(cors())
app.use(bodyParser.json())

express.urlencoded({ extended: false })
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/materials', routerMaterials)

app.listen(port, () => {
  console.log(`Backend server started on port ${port}...`)
})
