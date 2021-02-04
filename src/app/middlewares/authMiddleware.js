const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(request, response, next) {
  const { authorization } = request.headers;

  if (!authorization) {
    return response.sendStatus(401);
  }

  const token = authorization.replace('Bearer', '').trim();

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    request.userId = id;

    return next();
  } catch (error) {
    return response.sendStatus(401);
  }
};
