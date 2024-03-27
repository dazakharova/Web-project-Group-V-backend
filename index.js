const express = require('express')
const postsRouter = require('./routes/posts')
const commentsRouter = require('./routes/comments')
const authRouter = require('./routes/auth')

const app = express()

app.use(express.json())

const PORT = 3003

app.use('/api/posts', postsRouter)
app.use('/api/posts/comments', commentsRouter) 

app.listen(PORT)
console.log(`listening to port ${PORT}`)


