const postsRouter = require('express').Router()
const { query } = require('../helpers/db.js')


postsRouter.get('/', async(request, response) => {
    try {
        const result = await query('select * from posts')
        const rows = result.rows ? result.rows : []
        console.log(rows)
        response.status(200).json(rows)
    } catch (error) {
        console.error(error)
        response.statusMessage = error
        response.status(500).json({ error: error })
    }
})

postsRouter.post('/', async(request, response) => {
    const { user_id, title, body } = request.body

    try {
        const result = await query('insert into posts (user_id, title, body) values ($1, $2, $3) returning *',
            [user_id, title, body])
        console.error(result.rows[0].id)
        response.status(200).json({ id: result.rows[0].id})
    } catch (error) {
        console.error(error)
        response.statusMessage = error
        response.status(500).json({ error: error })
    }
})

postsRouter.delete('/:id', async(request, response) => {
    const post_id = parseInt(request.params.id)

    try {
        const result = await query('delete from posts where id = $1',
            [post_id])
        response.status(200).json({ id: post_id })
    } catch (error) {
        console.error(error)
        response.statusMessage = error
        response.status(500).json({ error: error })
    }
})

postsRouter.put('/:id', async(request, response) => {
    const post_id = parseInt(request.params.id)
    const { title, body } = request.body

    try {
        const result = await query('update posts set title = $1, body = $2 where id = $3 returning *',
            [title, body, post_id])
        response.status(200).json(result.rows[0])
    } catch (error) {
        console.error(error)
        response.statusMessage = error
        response.status(500).json({ error: error })
    }
})

module.exports = postsRouter