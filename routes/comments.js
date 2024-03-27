const commentRouter = require('express').Router();
const { query } = require('../helpers/db.js');
 
commentRouter.get('/:postId/comments', async (req, res) => {
  try{
    const postId = req.params.postId;
    const comments = await query(
      'SELECT * FROM comments WHERE post_id = $1',
      [postId]
    );
    res.send(comments);
  } catch (error) {
    console.error(error)
    response.statusMessage = error
    response.status(500).json({ error: error })
  }
});
 
commentRouter.post('/:postId/comments', async (req, res) => {
    try{
        const postId = req.params.postId;
        const { user_id, post_id, content } = req.body;
        const comment = await query(
        'INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3)',
        [user_id, post_id, content]
        );
        res.send(comment);
    } catch (error) {
        console.error(error)
        response.statusMessage = error
        response.status(500).json({ error: error })
    }
})
 
commentRouter.delete('/:postId/comments/:commentId', async (req, res) => {
    try{
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const comment = await query(
        'DELETE FROM comments WHERE post_id = $1 AND id = $2',
        [postId, commentId]
        );
        res.send(comment);
    } catch (error) {
        console.error(error)
        response.statusMessage = error
        response.status(500).json({ error: error })
    }
});
 
commentRouter.put('/:postId/comments/:commentId', async (req, res) => {
    try{
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const { content } = req.body;
        const comment = await query(
        'UPDATE comments SET content = $1 WHERE post_id = $2 AND id = $3',
        [content, postId, commentId]
        );
        res.send(comment);
    } catch (error) {
        console.error(error)
        response.statusMessage = error
        response.status(500).json({ error: error })
    }
})
module.exports = commentRouter;
