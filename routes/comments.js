const commentRouter = require('express').Router();
const { query } = require('../helpers/db.js');

commentRouter.get('/:postId', async (request, response) => {
  try{
    const postId = request.params.postId;
    const result = await query(
        'SELECT * FROM comments WHERE post_id = $1',
        [postId]
    );

    const rows = result.rows ? result.rows : []
    response.status(200).json(rows);
  } catch (error) {
    console.error(error)
    response.statusMessage = error
    response.status(500).json({ error: error })
  }
});

commentRouter.post('/:postId', async (request, response) => {
  try{
    const postId = request.params.postId;
    const { user_id, content } = request.body;
    const result = await query(
        'INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) returning *',
        [postId, user_id, content]
    );

    response.status(200).json({ id: result.rows[0].id })
  } catch (error) {
    console.error(error)
    response.statusMessage = error
    response.status(500).json({ error: error })
  }
})

commentRouter.delete('/:postId/:commentId', async (request, response) => {
  try{
    const postId = request.params.postId;
    const commentId = request.params.commentId;
    const result = await query(
        'DELETE FROM comments WHERE post_id = $1 AND id = $2',
        [postId, commentId]
    );

    response.status(200).json({ id: commentId })
  } catch (error) {
    console.error(error)
    response.statusMessage = error
    response.status(500).json({ error: error })
  }
});

commentRouter.put('/:postId/:commentId', async (request, response) => {
  try{
    const postId = request.params.postId;
    const commentId = request.params.commentId;
    const { user_id, content } = request.body;
    const result = await query(
        'UPDATE comments SET user_id = $1, content = $2 WHERE post_id = $3 AND id = $4 returning *',
        [user_id, content, postId, commentId]
    );

    response.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error)
    response.statusMessage = error
    response.status(500).json({ error: error })
  }
})

module.exports = commentRouter;
