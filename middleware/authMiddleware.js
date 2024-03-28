import jwt from 'jsonwebtoken';
import { USER_TYPES } from '../helpers/types.js';
const { verify } = jwt;

const authenticateToken = (req, res, next) => {
	const token = req.cookies.access_token;

  if (!token) {
    return res.sendStatus(401);
  }

  verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = decoded;
    next();
  });
};

export const authenticateTokenMiddleWare = (req, res, next) => {
  if (req.path === '/api/users/login' || req.method === 'GET') {
    next();
  } else {
    authenticateToken(req, res, next);
  }
}

export const hasAdminPermissions = async (req, res, next) => {
	if (req.user.permissions === USER_TYPES.ADMIN) {
    next();
  } else {
    return res.sendStatus(403);
  }
};