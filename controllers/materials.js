import { db } from '../db.js'// eslint-disable-line no-unused-vars
import materials from '../models/materials.js'

export async function createMaterial (request) {
  if (!request.name || !request.purpose) {
    return { status: 400, message: 'Отсутствует имя материала и/или назначение (basic/auxiliary)', material: undefined }
  }

  const material = await materials.findOne({ name: request.name })
    .catch(e => {
      console.log('Ошибка БД: createMaterial(): find(): ', e)
    })
  if (material) {
    return { status: 406, message: 'Такой материал уже есть', material: material.toObject() }
  }

  const result = await materials.insertMany(request)
    .catch(e => {
      console.log('Ошибка БД: createMaterial(): insertMany(): ', e)
    })
  if (result) {
    return { status: 200, message: `Материал ${request.name} успешно сохранен`, material: result[0].toObject() }
  } else {
    return { status: 500, message: `Не удалось сохранить материал: ${request.name}` }
  }
}

export async function updateMaterial (name, request) {
  const material = await materials.findOne({ name: name })
    .catch(e => {
      console.log('Ошибка БД: updateMaterial(): find(): ', e)
    })

  if (!material) {
    return { status: 404, message: `Материал не найден: ${name}` }
  }

  material.set(request)
  const result = await material.save()
    .catch(e => {
      console.log('Ошибка БД: updateMaterial(): save(): ', e)
    })
  if (result) {
    return { status: 200, message: `Материал ${name} успешно изменен`, material: result.toObject() }
  } else {
    return { status: 500, message: `Не удалось изменить материал: ${name}` }
  }
}

export async function deleteMaterial (name) {
  const material = await materials.findOneAndDelete({ name: name })
    .catch(e => {
      console.log('Ошибка БД: deleteMaterial(): find(): ', e)
    })

  if (!material) {
    return { status: 404, message: `Материал не найден: ${name}` }
  } else {
    return { status: 200, message: `Материал успешно удален: ${name}` }
  }
}

export async function getMaterials (search, purpose) {
  let filter = {
    name: { $regex: search ? `${search}` : '.*' }
  }
  if (purpose) {
    filter = { ...filter, purpose }
  }

  const materialsArray = await materials.find(filter).lean()
    .catch(e => {
      console.log('Ошибка БД: getMaterials(): find(): ', e)
    })

  return { status: 200, message: 'OK', materials: materialsArray }
}
