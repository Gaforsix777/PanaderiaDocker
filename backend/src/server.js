import cors from 'cors'
import express from 'express'
import mysql from 'mysql2/promise'

const app = express()
const port = process.env.PORT || 3000
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'panadero',
  password: process.env.DB_PASSWORD || 'panadero_pass',
  database: process.env.DB_NAME || 'panaderia',
  waitForConnections: true,
  connectionLimit: 10,
})

app.use(cors())
app.use(express.json())

app.get('/api/health', async (_request, response) => {
  try {
    await pool.query('SELECT 1')
    response.json({ status: 'ok', database: 'connected' })
  } catch {
    response.status(503).json({ status: 'error', database: 'unavailable' })
  }
})

app.get('/api/products', async (_request, response) => {
  try {
    const [products] = await pool.query(
      'SELECT id, name, category, description, price, image, featured FROM products ORDER BY featured DESC, id ASC',
    )
    response.json(products)
  } catch (error) {
    response.status(500).json({ error: 'No se pudieron cargar los productos.' })
  }
})

app.post('/api/orders', async (request, response) => {
  const { customerName, customerPhone, items, total } = request.body
  if (!customerName || !customerPhone || !Array.isArray(items) || !items.length) {
    return response.status(400).json({ error: 'Completa tus datos y agrega al menos un producto.' })
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO orders (customer_name, customer_phone, items_json, total) VALUES (?, ?, ?, ?)',
      [customerName, customerPhone, JSON.stringify(items), total],
    )
    response.status(201).json({ id: result.insertId, message: 'Pedido recibido correctamente.' })
  } catch (error) {
    response.status(500).json({ error: 'No se pudo guardar el pedido.' })
  }
})

app.listen(port, () => {
  console.log(`Panaderia API listening on port ${port}`)
})
