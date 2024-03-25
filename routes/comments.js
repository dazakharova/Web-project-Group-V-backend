const commentRouter = require('express').Router();
const comments = []; 

commentRouter.get('/:postId/comments', (req, res) => {
  const postId = req.params.postId;
  const postComments = comments.filter(comment => comment.post_id === postId);
  res.send(postComments);
});

commentRouter.post('/:postId/comments', (req, res) => {
  const postId = req.params.postId;
  const body = req.body;

  if (!body.text) {
    return res.status(400).send({ message: 'Comment text is required' });
  }

  const newComment = {
    comment_id: comments.length + 1,
    post_id: postId,
    user_id: 0,
    text: body.text,
  };

  comments.push(newComment);
  res.status(201).send(newComment);
});

module.exports = commentRouter;
