import { Router } from 'express'
import {
  createMaterial,
  updateMaterial
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
 *           description: Наименование основного материала
 *         category:
 *           type: string
 *           description: Категория основного материала
 *         purpose:
 *           type: string
 *           enum: [basic, auxiliary]
 *           description: Является ли материал основным (basic) или вспомогательным (auxiliary)
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
*/

/**
 * @swagger
 * /materials:
 *   post:
 *     summary: Добавление нового материала
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
 *               $ref: '#/components/schemas/Material'
 *       500:
 *         description: Не удалось сохранить материал
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Material'
 */

router.post('/',
  async (req, res, next) => {
    try {
      console.log('User wants to add new material')
      const result = await createMaterial(req.body)
      if (result) {
        res.status(200).json({ message: result.message, material: result.material })
      } else {
        res.status(result.status).json({ error: result.message })
      }
    } catch (error) {
      console.log('Unsuccessful POST/material request: ', error)
      return next(error)
    }
  }
)

/**
 * @swagger
 * /materials/{name}:
 *   put:
 *     summary: Изменение существующего материала по имени
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Наименование материала (url-encoded)
 *     example:
 *     name: %D0%9C%D0%BE%D0%BD%D1%82%D0%B0%D0%B6%20LED%20%D0%BF%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B8
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
 *         description: Новый материал успешно изменен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Material'
 *       400:
 *         description: Неправильное имя материала
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Материал не найден
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Не удалось изменить материал
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Material'
 */

router.put('/:name',
  async (req, res, next) => {
    try {
      if (!req.params.name) {
        console.log('Incorrect name of new material')
        res.status(400).json({ message: `Неправильное имя материала: ${req.params.name}` })
      }

      console.log('User wants to update new material')
      const result = await updateMaterial(decodeURI(req.params.name), req.body)
      if (result) {
        res.status(200).json({ message: result.message, material: result.material })
      } else {
        res.status(result.status).json({ error: result.message })
      }
    } catch (error) {
      console.log('Unsuccessful POST/material request: ', error)
      return next(error)
    }
  }
)
