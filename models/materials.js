import mongoose from 'mongoose'
import mongo from 'mongodb'

const { Schema } = mongoose
const { ObjectId } = mongo

const Material = new Schema({
  name: String,
  type: String,
  category: String,
  unit: String,
  priceNet: Number,
  auxilary: [
    {
      name: String,
      idAux: ObjectId,
      perUnit: Number
    }
  ]
})

export const materials = mongoose.model('materials', Material)
export default materials
