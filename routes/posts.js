const postsRouter = require('express').Router()

let posts = [] // temporary storage for posts for testing until database is created

postsRouter.get('/', (request, response) => {
    response.send(posts)
})

postsRouter.post('/', (request, response) => {
    const body = request.body

    const newPost = { "post_id": posts.length + 1, "user_id": 0, "title": body.title, "body": body.body, "likes_number": 0}

    posts.push(newPost)
    response.status(201).json(newPost)
})

postsRouter.delete('/:id', (request, response) => {
    const post_id = parseInt(request.params.id)

    posts = posts.filter(post => post.post_id !== post_id)
    response.status(204).send()
})

postsRouter.put('/:id', (request, response) => {
    const post_id = parseInt(request.params.id)
    const body = request.body

    posts = posts.map(post => {
        if (post.post_id === post_id) {
            return { ...post, title: body.title, body: body.body, likes: body.likes }
        }
        return post
    })

    response.status(200).send()
})

module.exports = postsRouter