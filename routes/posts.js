const postsRouter = require('express').Router()

const posts = [] // temporary storage for posts for testing until database is created

postsRouter.get('/', (request, response) => {
    response.send(posts)
})

postsRouter.post('/', (request, response) => {
    const body = request.body

    const newPost = { "post_id": posts.length + 1, "user_id": 0, "title": body.title, "body": body.body, "likes_number": 0}

    posts.push(newPost)
    response.status(200)
})

postsRouter.delete('/:id', (request, response) => {
    const post_id = request.params.id

    posts = posts.filter(post => post.post_id !== post_id)
})

postsRouter.put('/:id', (request, response) => {
    const post_id = request.params.id
    const body = request.body

    posts = posts.map(post => {
        if (post.post_id === post_id) {
            post.title = body.title
            post.body = body.body
            post.likes = body.likes
        }
    })

    response.status(201)
})

module.exports = postsRouter