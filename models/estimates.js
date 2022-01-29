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
  total: Number,
  items: [
    {
      name: String,
      stage: String,
      priceNet: Number,
      priceTotal: Number,
      amount: Number,
      coeffIndividual: Number,
      auxiliary: [
        {
          name: String,
          amount: Number
        }
      ]
    }
  ]
})

export const estimates = mongoose.model('estimates', Estimates)
export default estimates
