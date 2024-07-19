const express = require('express')
const { join } = require('path')
const helmet = require('helmet')
const cors = require('cors')
const app = express()
const PORT = 3333 // Chọn một cổng tự chọn

// Định nghĩa các route và middleware của ứng dụng Express
app.use(cors())
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", 'http://localhost:3052', 'http://localhost:3333']
      // Các directives khác nếu cần
    }
  })
)
app.get('/', (req, res) => {
  res.status(200).json({
    data: 'ok'
  })
})

// Khởi động máy chủ
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
