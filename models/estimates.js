import mongoose from 'mongoose'

const { Schema } = mongoose

const Estimates = new Schema({
  name: String,
  date: Date,
  customer: String,
  residence: String,
  layout: String,
  style: String,
  coeffCommon: Number,
  totalEstimate: Number,
  items: [
    {
      name: String,
      category: String,
      stage: String,
      unit: String,
      priceNet: Number,
      amount: Number,
      coeffIndividual: Number,
      auxiliary: [
        {
          name: String,
          category: String,
          unit: String,
          priceNet: Number,
          amount: Number
        }
      ]
    }
  ]
})

export const estimates = mongoose.model('estimates', Estimates)
export default estimates
