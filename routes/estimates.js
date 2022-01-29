import { Router } from 'express'
import {
  createEstimate,
  updateEstimate,
  deleteEstimate,
  getEstimates
} from '../controllers/estimates.js'
const router = Router()
export default router

/**
 * @swagger
 * components:
 *   schemas:
 *     Estimate:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Наименование сметы
 *         date:
 *           type: string
 *           description: Дата составления сметы
 *         customer:
 *           type: string
 *           description: Покупатель/Клиент
 *         residence:
 *           type: string
 *           description: Жилой комплекс
 *         layout:
 *           type: string
 *           description: Тип планировки
 *         style:
 *           type: string
 *           description: Стиль планировки
 *         coeffCommon:
 *           type: number
 *           description: Повышающий коэффициент для всей сметы
 *         items:
 *           type: array
 *           description: Массив строк сметы
 *           items:
 *             allOf:
 *               - $ref: '#components/schemas/Material'
 *               - type: object
 *                 properties:
 *                   stage:
 *                     type: string
 *                     description: Этап проведения строительных работ
 *                   amount:
 *                     type: number
 *                     description: Количество основного материала
 *                   priceTotal:
 *                     type: number
 *                     description: Цена на основной маиериал с учетом вспомогательных
 *                   coeffIndividual:
 *                     type: number
 *                     description: Индивидуальный повышающий коэффициент для основного материала
 *                   auxiliary:
 *                     type: array
 *                     description: Массив вспомогательных материалов
 *                     items:
 *                       allOf:
 *                         - $ref: '#components/schemas/Material'
 *                         - type: object
 *                           properties:
 *                             amount:
 *                               type: number
 *                               description: Количество вспомогательного материала
 *         total:
 *           type: number
 *           description: Общая сумма сметы
 *   examples:
 *     Estimate:
 *       value:
 *         name: Типовая смета
 *         date: Fri Jan 28 2022 10:43:26 GMT+0300 (Moscow Standard Time)
 *         residence: ЖК Алые Паруса
 *         customer: Конрад Карлович Михельсон
 *         layot: 2x комнатная квартира
 *         style: Классический
 *         coeffCommon: 1.2
 *         total: 42000
 *         items: [{
 *           name: Монтаж LED подсветки,
 *           purpose: basic,
 *           stage: Чистовая отделка,
 *           priceNet: 4000,
 *           priceTotal: 4200,
 *           amount: 10,
 *           coeffIndividual: 1.0,
 *             auxiliary: [{
 *               name: Скрепки,
 *               unit: шт,
 *               priceNet: 20,
 *               amount: 10
 *           }]
 *         }]
*/

/**
 * @swagger
 * /estimates:
 *   post:
 *     summary: Добавление новой сметы
 *     tags: [estimates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/Estimate'
 *               - type: object
 *                 required:
 *           examples:
 *             body:
 *               $ref: '#/components/examples/Estimate'
 *     responses:
 *       200:
 *         description: Новая смета успешно добавлена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Смета успешно сохранена
 *                 estimate:
 *                   $ref: '#/components/schemas/Estimate'
 *               example:
 *                 message: Смета успешно сохранена
 *                 estimate:
 *                   name: Типовая смета
 *                   date: Fri Jan 28 2022 10:43:26 GMT+0300 (Moscow Standard Time)
 *                   residence: ЖК Алые Паруса
 *                   customer: Конрад Карлович Михельсон
 *                   layot: 2x комнатная квартира
 *                   style: Классический
 *                   coeffCommon: 1.2
 *                   total: 42000
 *                   items: [{
 *                     name: Монтаж LED подсветки,
 *                     purpose: basic,
 *                     stage: Чистовая отделка,
 *                     priceNet: 4000,
 *                     priceTotal: 4200,
 *                     amount: 10,
 *                     coeffIndividual: 1.0,
 *                       auxiliary: [{
 *                         name: Скрепки,
 *                         unit: шт,
 *                         priceNet: 20,
 *                         amount: 10
 *                     }]
 *                   }]
 *       400:
 *         description: Отсутствует имя сметы
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Отсутствует имя сметы
 *       406:
 *         description: Такая смета уже есть
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: Такой смета уже есть
 *       500:
 *         description: Не удалось сохранить смету
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: 'Не удалось сохранить смету: Типовая смета'
 */

router.post('/',
  async (req, res, next) => {
    try {
      console.log('User wants to add new estimate')
      const result = await createEstimate(req.body)
      if (result.status === 200) {
        res.status(200).json({ message: result.message, estimate: result.estimate })
      } else {
        res.status(result.status).json({ error: result.message })
      }
    } catch (error) {
      console.log('Unsuccessful POST/estimates request: ', error)
      return next(error)
    }
  }
)

/**
 * @swagger
 * /estimates/{name}:
 *   put:
 *     summary: Изменение существующей сметы по имени
 *     tags: [estimates]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *           example: '%D0%A2%D0%B8%D0%BF%D0%BE%D0%B2%D0%B0%D1%8F%20%D1%81%D0%BC%D0%B5%D1%82%D0%B0%0A'
 *         required: true
 *         description: Наименование сметы (url-encoded)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/Estimate'
 *               - type: object
 *                 required:
 *           examples:
 *             body:
 *               $ref: '#/components/examples/Estimate'
 *     responses:
 *       200:
 *         description: Смета успешно изменена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Смета успешно изменена
 *                 estimate:
 *                   $ref: '#/components/schemas/Estimate'
 *               example:
 *                 message: Смета успешно изменена
 *                 estimate:
 *                   name: Типовая смета
 *                   date: Fri Jan 28 2022 10:43:26 GMT+0300 (Moscow Standard Time)
 *                   residence: ЖК Алые Паруса
 *                   customer: Конрад Карлович Михельсон
 *                   layot: 2x комнатная квартира
 *                   style: Классический
 *                   coeffCommon: 1.2
 *                   total: 42000
 *                   items: [{
 *                     name: Монтаж LED подсветки,
 *                     purpose: basic,
 *                     stage: Чистовая отделка,
 *                     priceNet: 4000,
 *                     priceTotal: 4200,
 *                     amount: 10,
 *                     coeffIndividual: 1.0,
 *                       auxiliary: [{
 *                         name: Скрепки,
 *                         unit: шт,
 *                         priceNet: 20,
 *                         amount: 10
 *                     }]
 *                   }]
 *       400:
 *         description: Отсутствует имя сметы
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Отсутствует имя сметы
 *               example:
 *                 message: Отсутствует имя сметы
 *       404:
 *         description: Смета не найдена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Смета не найдена
 *               example:
 *                 message: 'Смета не найдена: Типовая смета'
 *       500:
 *         description: Не удалось изменить смету
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Не удалось изменить смету
 *               example:
 *                 message: 'Не удалось изменить смету: Типовая смета'
 */

router.put('/:name',
  async (req, res, next) => {
    try {
      if (!req.params.name) {
        console.log('Incorrect name of updating estimate')
        res.status(400).json({ message: 'Отсутствует имя сметы' })
      }

      console.log('User wants to update new estimate')
      const result = await updateEstimate(decodeURI(req.params.name), req.body)
      if (result.status === 200) {
        res.status(200).json({ message: result.message, estimate: result.estimate })
      } else {
        res.status(result.status).json({ error: result.message })
      }
    } catch (error) {
      console.log('Unsuccessful POST/estimates request: ', error)
      return next(error)
    }
  }
)

/**
 * @swagger
 * /estimates/{name}:
 *   delete:
 *     summary: Удаление существующейм сметы по имени
 *     tags: [estimates]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *           example: '%D0%A2%D0%B8%D0%BF%D0%BE%D0%B2%D0%B0%D1%8F%20%D1%81%D0%BC%D0%B5%D1%82%D0%B0%0A'
 *         required: true
 *         description: Наименование сметы (url-encoded)
 *     responses:
 *       200:
 *         description: Смета успешно удалена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Смета успешно удалена
 *               example:
 *                 message: 'Смета успешно удалена: Типовая смета'
 *       400:
 *         description: Отсутствует имя сметы
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Отсутствует имя сметы
 *               example:
 *                 message: Отсутствует имя сметы
 *       404:
 *         description: Смета не найдена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Смета не найдена
 *               example:
 *                 message: 'Смета не найдена: Типовая смета'
 *       500:
 *         description: Не удалось удалить смету
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Не удалось удалить смету
 *               example:
 *                 message: 'Не удалось удалить смету: Типовая смета'
 */

router.delete('/:name',
  async (req, res, next) => {
    try {
      if (!req.params.name) {
        console.log('Incorrect name of deleted estimate')
        res.status(400).json({ message: { message: 'Отсутствует имя сметы' } })
      }

      console.log('User wants to delete new estimate')
      const result = await deleteEstimate(decodeURI(req.params.name), req.body)
      if (result.status === 200) {
        res.status(200).json({ message: result.message })
      } else {
        res.status(result.status).json({ error: result.message })
      }
    } catch (error) {
      console.log('Unsuccessful POST/estimates request: ', error)
      return next(error)
    }
  }
)

/**
 * @swagger
 * /estimates:
 *   get:
 *     summary: Выдача смет по критерию поиска
 *     tags: [estimates]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: '%D0%A2%D0%B8%D0%BF%D0%BE%D0%B2%D0%B0%D1%8F%20%D1%81%D0%BC%D0%B5%D1%82%D0%B0%0A'
 *         description: Поисковая строка
 *     responses:
 *       200:
 *         description: Успешная выдача
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: Массив смет, соответствующих критерию поиска
 *               items:
 *                 $ref: '#components/schemas/Estimate'
 */

router.get('/',
  async (req, res, next) => {
    try {
      console.log('User wants to get estimates')
      const result = await getEstimates(req.query?.search, req.query?.purpose)
      if (result.status === 200) {
        res.status(200).json({ message: result.message, estimates: result.estimates })
      } else {
        res.status(result.status).json({ error: result.message })
      }
    } catch (error) {
      console.log('Unsuccessful POST/estimates request: ', error)
      return next(error)
    }
  }
)
