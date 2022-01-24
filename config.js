import dotenv from 'dotenv'

dotenv.config()

export const URL = 'http://62.113.99.170:8281'
export const ADMIN_EMAIL = 'qualaddar@gmail.com'
export const corsOptions = {
  origin: ['localhost', '62.113.99.170', 'http://212.124.6.145']
}

// ?const whitelist = ['localhost', '62.113.99.170', 'http://212.124.6.145:3000']
// ?export const corsOptions = {
// ?  origin: function (origin, callback) {
// ?    if (whitelist.indexOf(origin) !== -1) {
// ?      callback(null, true)
// ?    } else {
// ?      callback(new Error(`Незваный гость хуже татарина: ${origin}`))
// ?    }
// ?  }
// ?}

export const MONGO_HOSTNAME = '62.113.99.170'
export const MONGO_PORT = '27017'
export const MONGO_DB = process.env.MONGO_DB || 'Apartest'
// ?export const MONGO_USERNAME = process.env.MONGO_USERNAME
// ?export const MONGO_PASSWORD = process.env.MONGO_PASSWORD

export const JWT_SIGN = process.env.JWT_SIGN

// ?export const EMAIL_CONFIRM_LINK = 'https://superiorityai.ru/email/'
// ?export const SMTP_PASS = process.env.SMTP_PASS

// ?export const SHOP_ID = 812889
// ?export const SHOP_KEY = process.env.SHOP_KEY
// ?export const OAUTH_2_0 = process.env.OAUTH_2_0
