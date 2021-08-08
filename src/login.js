const users = require('../db/users.json');
const { sign } = require('jsonwebtoken');

const JWT_KEY = process.env.JWT_KEY;

const login = async event => {
  console.log('Login invoked!...', new Date().toISOString(), event.body);

  try {
    const {
      username,
      password
    } = JSON.parse(event.body);

    const validUser = users.find(
      user =>
        user.username.toLowerCase() === username.toLowerCase() &&
        user.password === password);

    if (!validUser) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: 'Unauthorized'
        })
      }
    }

    const signUser = {
      scopes: validUser.scopes,
      username: validUser.username
    }

    const token = sign({
      user: signUser
    }, JWT_KEY, { expiresIn: '5m' });

    return {
      statusCode: 200,
      body: JSON.stringify({ token })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error!'
      })
    }
  }
}

exports.handler = login;