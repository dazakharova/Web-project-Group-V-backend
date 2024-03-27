const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authRouter = require('express').Router()
const { query } = require('../helpers/db.js')

authRouter.get('/test', (req, res) => res.send('Test route is working'));


// The /register endpoint handler
authRouter.post('/register', async(request, response) => {
    const { username, password } = request.body

    try {
        // Check if the user already exists
        const userExists = await query('select * from users where username = $1',
            [username])
        if (userExists.rows.length) {
            return response.status(400).send({ message: 'Username already exists' })
        }

        // Hash password
        const saltRounds = 10; // Cost factor for hashing
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log(hashedPassword)

        // Insert the new user into the database
        const newUser = await query('insert into users (username, password) values ($1, $2) returning *',
            [username, hashedPassword]
        );

        // Respond with the created user (excluding password)
        delete newUser.rows[0].password;
        response.status(201).send(newUser.rows[0]);
    } catch (error) {
        console.error('Error registering new user:', error);
        response.status(500).send({ message: 'Internal server error' });
    }
})

// The /login endpoint handler
authRouter.post('/login', async(request, response) => {
    const { username, password } = request.body

    try {
        // Check if the user exists
        const result = await query('select * from users where username = $1', [username])
        if (result.rows.length === 0) {
            return response.status(401).send({ message: 'Invalid username or password.' })
        }

        const user = result.rows[0]

        // Compare provided password with stored hash
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return response.status(401).send({ message: 'Invalid username or password.' })
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        // Send the token to the client
        response.send({ token })
    } catch (error) {
        console.error('Login error:', error)
        response.status(500).send({ message: 'Internal server error' })
    }
})

authRouter.post('/logout', (request, response) => {
    // Set the JWT cookie to a past expiration date, clearing it
    response.cookie('token', '', { expires: new Date(0) });

    response.status(200).send({ message: 'Logged out successfully' });
})

authRouter.get('/profile', authenticateToken, async(request, response) => {
    try {
        const userId = request.user.userId

        // Get user's posts
        const postsResult = await query('select * from posts where user_id = $1', [userId])

        // Get comments for each post
        const postsWithComments = await Promise.all(postsResult.rows.map(async (post) => {
            const commentsResult = await query('select * from comments where post_id = $1', [post.id])
            return {...post, comments: commentsResult.rows} // returns array, each object of it has post's properties and property 'comments' inside which there are comments' properties
        }))

        response.status(200).json({ posts: postsWithComments })
    } catch (error) {
        console.error('Profile data fetch error:', error)
        response.status(500).send({ message: 'Internal server error' })
    }
})

// Middleware to authenticate and authorize users
const authenticateToken = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // If no token, deny access

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) return response.sendStatus(403); // If token is not valid or expired
        request.user = user;
        next();
    });
};

// Example of protecting a route
// authRouter.get('/protected', authenticateToken, (request, response) => {
//     response.send('This is a protected route.');
// });



module.exports = authRouter