import { Router } from 'express'
import { db } from '../db.js'// eslint-disable-line no-unused-vars
import materials from '../models/materials.js'
const router = Router()
export default router

/**
 * @swagger
 * components:
 *   schemas:
 *     Auxiliary:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Название вспомогательного материала
 *         unit:
 *           type: string
 *           description: Единица измерения вспомогательного материала
 *         perUnit:
 *           type: number
 *           description: Количество вспомогательного материала на единицу основного
 *         price:
 *           type: number
 *           description: Цена вспомогательного материала
 *         sumPerUnit:
 *           type: number
 *           description: Стоимость вспомогательного материала на единицу основного
 *     Material:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - unit
 *         - priceNet
 *       properties:
 *         name:
 *           type: string
 *           description: Наименование основного материала
 *         category:
 *           type: string
 *           description: Категория основного материала
 *         type:
 *           type: string
 *           description: Является ли материал основным (basic) или вспомогательным (auxiliary)
 *         unit:
 *           type: string
 *           description: Единица измерения основного материала
 *         priceNet:
 *           type: number
 *           description: Цена основного материала без учета вспомогательных
 *         priceTotal:
 *           type: number
 *           description: Цена основного материала с учетом вспомогательных
 *         auxiliary:
 *           type: array
 *           description: Вспомогательные материалы
 *           items:
 *             allOf:
 *               - $ref: '#components/schemas/Auxiliary'
 *               - type: object
 *                 properties:
 *                   idAux:
 *                     type: string
 *                     description: Ссылка на вспомогательный материал в БД
 */

/**
 * @swagger
 * /materials:
 *   post:
 *     summary: Добавление нового основного материала
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Material'
 *     responses:
 *       200:
 *         description: Новый основной материал успешно добавлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Material'
 */

router.post('/',
  async (req, res, next) => {
    try {
      console.log('User wants to add new material')
      const result = await materials.insertMany(req.body)
      if (result) {
        res.status(200).json({ message: result.message, material: result })
      } else {
        res.status(result.status).json({ error: result.message })
      }
    } catch (error) {
      console.log('Unsuccessful POST/material request')
      return next(error)
    }
  }
)
