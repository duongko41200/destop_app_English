const express = require('express')
const { join } = require('path')
const helmet = require('helmet')
const cors = require('cors')
const Redis = require('ioredis');
const app = express()
const PORT = 3333 // Chọn một cổng tự chọn
const bodyParser = require('body-parser');



app.use(bodyParser.json()); // Cho phép parse application/json
app.use(bodyParser.urlencoded({ extended: true }))
// Định nghĩa các route và middleware của ứng dụng Express
app.use(cors())
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", 'https://bot-app-english-apiss.vercel.app', 'http://localhost:3333']
      // Các directives khác nếu cần
    }
  })
)


app.use('/', require('./routes/index'));
// app.get('/', (req, res) => {
//   res.status(200).json({
//     data: 'ok'
//   })
// })

app.get('/test', async(req, res) => {
  try {
    // Tạo một client Redis
    const client = new Redis();

    // Đối tượng mới cần thêm vào List 'users'
    const newUser = { id: 2, name: 'Bob', age: 25 };

    // Thêm đối tượng mới vào List 'users'
    await client.rpush('users', JSON.stringify(newUser));

    // In ra thông báo khi thêm thành công
    console.log('New user added successfully.');

    // Đóng kết nối Redis
    await client.quit();
  } catch (error) {
    console.error('Error:', error);
  }
})

// Khởi động máy chủ
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
