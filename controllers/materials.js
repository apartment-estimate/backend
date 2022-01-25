import { db } from '../db.js'// eslint-disable-line no-unused-vars
import materials from '../models/materials.js'

export async function createMaterial (request) {
  const result = await materials.insertMany(request)
    .catch(e => {
      console.log('Ошибка БД: createMaterial(): insertMany(): ', e)
    })
  if (result) {
    return { status: 200, message: result.message, material: result.toObject() }
  } else {
    return { status: 500, message: 'Не удалось сохранить материал:\n' + JSON.stringify(request, null, '  ') }
  }
}

export async function updateMaterial (name, request) {
  const material = await materials.findOne({ name: name })
    .catch(e => {
      console.log('Ошибка БД: updateMaterial(): find(): ', e)
    })

  material.set(request)
  const result = await material.save()
    .catch(e => {
      console.log('Ошибка БД: updateMaterial(): save(): ', e)
    })
  if (result) {
    return { status: 200, message: result.message, material: result.toObject() }
  } else {
    return { status: 500, message: 'Не удалось изменить материал:\n' + JSON.stringify(request, null, '  ') }
  }
}
