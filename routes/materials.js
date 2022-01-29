import { Router } from 'express'
import {
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getMaterials
} from '../controllers/materials.js'
const router = Router()
export default router

/**
 * @swagger
 * components:
 *   schemas:
 *     Material:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Наименование материала
 *         category:
 *           type: string
 *           description: Категория материала
 *         purpose:
 *           type: string
 *           enum: [basic, auxiliary]
 *           description: 'Назначение материала: основной или вспомогательный (basic/auxiliary)'
 *         unit:
 *           type: string
 *           description: Единица измерения основного материала
 *         priceNet:
 *           type: number
 *           description: Цена материала без учета вспомогательных
 *       example:
 *         name: Монтаж LED подсветки
 *         purpose: basic
 *         category: Электрика
 *         unit: шт
 *         priceNet: 3360.00
*/

/**
  * @swagger
  * tags:
  *   - name: materials
  *     description: Используемые материалы
  *   - name: estimates
  *     description: Создаваемые сметы
  */

/**
 * @swagger
 * /materials:
 *   post:
 *     summary: Добавление нового материала
 *     tags: [materials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/Material'
 *               - type: object
 *                 required:
 *                   - purpose
 *                   - category
 *                   - unit
 *                   - priceNet
 *           example:
 *             name: Монтаж LED подсветки
 *             purpose: basic
 *             category: Электрика
 *             unit: шт
 *             priceNet: 4000.00
 *     responses:
 *       200:
 *         description: Новый основной материал успешно добавлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Материал успешно сохранен
 *                 material:
 *                   $ref: '#/components/schemas/Material'
 *               example:
 *                 message: Материал Монтаж LED подсветки успешно сохранен
 *                 material:
 *                   name: Монтаж LED подсветки
 *                   purpose: basic
 *                   category: Электрика
 *                   unit: шт
 *                   priceNet: 4000
 *       400:
 *         description: Отсутствует имя материала
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Отсутствует имя материала
 *       406:
 *         description: Такой материал уже есть
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Такой материал уже есть
 *                 material:
 *                   name: Монтаж LED подсветки
 *                   purpose: basic
 *                   category: Электрика
 *                   unit: шт
 *                   priceNet: 4000
 *       500:
 *         description: Не удалось сохранить материал
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: 'Не удалось сохранить материал: Монтаж LED подсветки'
 */

router.post('/',
  async (req, res, next) => {
    try {
      console.log('User wants to add new material')
      const result = await createMaterial(req.body)
      if (result.status === 200) {
        res.status(200).json({ message: result.message, material: result.material })
      } else {
        res.status(result.status).json({ error: result.message })
      }
    } catch (error) {
      console.log('Unsuccessful POST/materials request: ', error)
      return next(error)
    }
  }
)

/**
 * @swagger
 * /materials/{name}:
 *   put:
 *     summary: Изменение существующего материала по имени
 *     tags: [materials]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *           example: '%D0%9C%D0%BE%D0%BD%D1%82%D0%B0%D0%B6%20LED%20%D0%BF%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B8'
 *         required: true
 *         description: Наименование материала (url-encoded)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Material'
 *           example:
 *             purpose: auxiliary
 *             category: Светильники
 *             priceNet: 3000.00
 *     responses:
 *       200:
 *         description: Материал успешно изменен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Материал успешно изменен
 *                 material:
 *                   $ref: '#/components/schemas/Material'
 *               example:
 *                 message: Материал Монтаж LED подсветки успешно изменен
 *                 material:
 *                   name: Монтаж LED подсветки
 *                   purpose: basic
 *                   category: Электрика
 *                   unit: шт
 *                   priceNet: 4000
 *       400:
 *         description: Отсутствует имя материала
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Отсутствует имя материала
 *               example:
 *                 message: Отсутствует имя материала
 *       404:
 *         description: Материал не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Материал не найден
 *               example:
 *                 message: 'Материал не найден: Монтаж LED подсветки'
 *       500:
 *         description: Не удалось изменить материал
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Не удалось изменить материал
 *               example:
 *                 message: 'Не удалось изменить материал: Монтаж LED подсветки'
 */

router.put('/:name',
  async (req, res, next) => {
    try {
      if (!req.params.name) {
        console.log('Incorrect name of updating material')
        res.status(400).json({ message: 'Отсутствует имя материала' })
      }

      console.log('User wants to update new material')
      const result = await updateMaterial(decodeURI(req.params.name), req.body)
      if (result.status === 200) {
        res.status(200).json({ message: result.message, material: result.material })
      } else {
        res.status(result.status).json({ error: result.message })
      }
    } catch (error) {
      console.log('Unsuccessful POST/materials request: ', error)
      return next(error)
    }
  }
)

/**
 * @swagger
 * /materials/{name}:
 *   delete:
 *     summary: Удаление существующего материала по имени
 *     tags: [materials]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *           example: '%D0%9C%D0%BE%D0%BD%D1%82%D0%B0%D0%B6%20LED%20%D0%BF%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B8'
 *         required: true
 *         description: Наименование материала (url-encoded)
 *     responses:
 *       200:
 *         description: Новый материал успешно удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Материал успешно удален
 *               example:
 *                 message: 'Материал успешно удален: Монтаж LED подсветки'
 *       400:
 *         description: Отсутствует имя материала
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Отсутствует имя материала
 *               example:
 *                 message: Отсутствует имя материала
 *       404:
 *         description: Материал не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Материал не найден
 *               example:
 *                 message: 'Материал не найден: Монтаж LED подсветки'
 *       500:
 *         description: Не удалось удалить материал
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Не удалось удалить материал
 *               example:
 *                 message: 'Не удалось удалить материал: Монтаж LED подсветки'
 */

router.delete('/:name',
  async (req, res, next) => {
    try {
      if (!req.params.name) {
        console.log('Incorrect name of deleted material')
        res.status(400).json({ message: { message: 'Отсутствует имя материала' } })
      }

      console.log('User wants to delete new material')
      const result = await deleteMaterial(decodeURI(req.params.name), req.body)
      if (result.status === 200) {
        res.status(200).json({ message: result.message })
      } else {
        res.status(result.status).json({ error: result.message })
      }
    } catch (error) {
      console.log('Unsuccessful POST/materials request: ', error)
      return next(error)
    }
  }
)

/**
 * @swagger
 * /materials:
 *   get:
 *     summary: Выдача материалов по критерию поиска
 *     tags: [materials]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: '%D0%9C%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%B0%D0%BB'
 *         description: Поисковая строка
 *       - in: query
 *         name: purpose
 *         schema:
 *           type: string
 *           enum: [basic, auxiliary]
 *           example: basic
 *         description: Является ли материал основным (basic) или вспомогательным (auxiliary)
 *     responses:
 *       200:
 *         description: Успешная выдача
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: Массив материалов, соответствующих критерию поиска
 *               items:
 *                 $ref: '#components/schemas/Material'
 *       400:
 *         description: Неверные параметры запроса
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Неверные параметры запроса
 *               example:
 *                 message: Неверные параметры запроса
 */

router.get('/',
  async (req, res, next) => {
    try {
      if (req.params?.purpose &&
         (req.params?.purpose === 'auxiliary' ||
          req.params?.purpose === 'basic')
      ) {
        console.log('Incorrect request parameters')
        res.status(400).json({ message: 'Неверные параметры запроса' })
        return next()
      }

      console.log('User wants to get materials')
      const result = await getMaterials(req.query?.search, req.query?.purpose)
      if (result.status === 200) {
        res.status(200).json({ message: result.message, materials: result.materials })
      } else {
        res.status(result.status).json({ error: result.message })
      }
    } catch (error) {
      console.log('Unsuccessful POST/materials request: ', error)
      return next(error)
    }
  }
)
