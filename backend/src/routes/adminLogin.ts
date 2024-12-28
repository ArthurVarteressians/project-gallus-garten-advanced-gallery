import express, { Request, Response } from 'express'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

// Environment variables for admin credentials
const adminUser = process.env.GALLUS_ADMIN_USER
const adminPassword = process.env.GALLUS_ADMIN_PASSWORD

// Login endpoint
router.post('/', (req: Request, res: Response) => {
  const { username, password } = req.body

  // Check if the credentials match
  if (username === adminUser && password === adminPassword) {
    return res.status(200).json({ message: 'Login successful' })
  }

  // Return 401 if credentials are invalid
  return res.status(401).json({ message: 'Invalid username or password' })
})

export default router
