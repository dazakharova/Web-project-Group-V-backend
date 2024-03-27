const express = require('express')
const cors = require('cors')
const postsRouter = require('./routes/posts')
const commentsRouter = require('./routes/comments')
const authRouter = require('./routes/auth')

const app = express()

app.use(express.json())
app.use(cors())

const PORT = 3001

app.use('/api/posts', postsRouter)
app.use('/auth', authRouter)
app.use('/api/comments', commentsRouter)

app.listen(PORT)
console.log(`listening to port ${PORT}`)


