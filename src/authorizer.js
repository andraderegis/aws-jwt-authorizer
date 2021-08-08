const jwt = require('jsonwebtoken');
const { buildIAMPolicy } = require('./lib/util');

const JWT_KEY = process.env.JWT_KEY;

const myRoles = {
  'heroes:list': 'private'
}

const authorizerUser = (userScopes, methodArn) => {
  return userScopes.find(scope => ~methodArn.indexOf(myRoles[scope]));
}

exports.handler = async event => {
  const token = event.authorizationToken;

  try {
    const decodedUser = jwt.verify(
      token, JWT_KEY
    );

    console.log({ decodedUser });

    const user = decodedUser.user;
    const userId = user.username;
    const isAllowed = authorizerUser(
      user.scopes,
      event.methodArn
    );

    // it will be send in requests
    const authorizerContext = {
      user: JSON.stringify(user)
    }

    const policyDocument = buildIAMPolicy(
      userId,
      isAllowed ? 'Allow' : 'Deny',
      event.methodArn,
      authorizerContext
    );

    return policyDocument;
  } catch (error) {
    console.error('auth error**', error.stack);
    // 401 - expired or invalid token
    // 403 - token unauthorized to access function
    return {
      statusCode: 401,
      body: 'Unauthorized'
    }
  }
}