import mongoose from 'mongoose'

import { MONGO_HOSTNAME, MONGO_PORT, MONGO_DB } from './config.js'

const url = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`

// ?mongoose.set('useFindAndModify', false)
export const db = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(
  () => console.log('Есть соединение с БД...'),
  (err) => console.log('Ошибка соединения с БД: ', err)
)
