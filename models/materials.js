import mongoose from 'mongoose'

const { Schema } = mongoose

const Material = new Schema({
  name: String,
  type: String,
  category: String,
  unit: String,
  priceNet: Number
})

export const materials = mongoose.model('materials', Material)
export default materials
