require('dotenv').config()
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


module.exports = authRouter