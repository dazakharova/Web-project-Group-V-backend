const bcrypt = require('bcrypt')
const registerRouter = require('express').Router()
const { query } = require('../helpers/db.js')


registerRouter.post('/', async(request, response) => {
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


module.exports = registerRouter