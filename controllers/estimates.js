import { db } from '../db.js'// eslint-disable-line no-unused-vars
import estimates from '../models/estimates.js'

export async function createEstimate (request) {
  if (!request.name) {
    return { status: 400, message: 'Отсутствует имя сметы', estimate: undefined }
  }

  const estimate = await estimates.findOne({ name: request.name })
    .catch(e => {
      console.log('Ошибка БД: createEstimate(): find(): ', e)
    })
  if (estimate) {
    return { status: 406, message: 'Такая смета уже есть', estimate: estimate.toObject() }
  }

  const result = await estimates.insertMany(request)
    .catch(e => {
      console.log('Ошибка БД: createEstimate(): insertMany(): ', e)
    })
  if (result) {
    return { status: 200, message: `Смета ${request.name} успешно сохранена`, estimate: result[0].toObject() }
  } else {
    return { status: 500, message: `Не удалось сохранить смету: ${request.name}` }
  }
}

export async function updateEstimate (name, request) {
  const estimate = await estimates.findOne({ name: name })
    .catch(e => {
      console.log('Ошибка БД: updateEstimate(): find(): ', e)
    })

  if (!estimate) {
    return { status: 404, message: `Смета не найдена: ${name}` }
  }

  estimate.set(request)
  const result = await estimate.save()
    .catch(e => {
      console.log('Ошибка БД: updateEstimate(): save(): ', e)
    })
  if (result) {
    return { status: 200, message: `Смета ${name} успешно изменена`, estimate: result.toObject() }
  } else {
    return { status: 500, message: `Не удалось изменить смету: ${name}` }
  }
}

export async function deleteEstimate (name) {
  const estimate = await estimates.findOneAndDelete({ name: name })
    .catch(e => {
      console.log('Ошибка БД: deleteEstimate(): find(): ', e)
    })

  if (!estimate) {
    return { status: 404, message: `Смета не найдена: ${name}` }
  } else {
    return { status: 200, message: `Смета успешно удалена: ${name}` }
  }
}

export async function getEstimates (search) {
  const filter = {
    name: { $regex: search ? `${search}` : '.*' }
  }

  const estimatesArray = await estimates.find(filter).lean()
    .catch(e => {
      console.log('Ошибка БД: getEstimates(): find(): ', e)
    })

  return { status: 200, message: 'OK', estimates: estimatesArray }
}
