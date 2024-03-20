const express = require('express')
const postsRouter = require('./routes/posts')

const app = express()

app.use(express.json())

const PORT = 3001

app.use('/api/posts', postsRouter)


app.listen(PORT)
console.log(`listening to port ${PORT}`)