const express = require('express')
const postsRouter = require('./routes/posts')
const commentsRouter = require('./routes/comments')

const app = express()

const PORT = 3001

app.use('/api/posts', postsRouter)
app.use('/api/posts/:postId/comments', commentsRouter) 

app.listen(PORT)
console.log(`listening to port ${PORT}`)
