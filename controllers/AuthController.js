/* eslint-disable */
import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';
import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';

class AuthController {
  static async getConnect(req, res) {
    try {
      const authHeader = req.headers.Authorization || null;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ error: 'Unauthorized' });
      }

      const buff = Buffer.from(authHeader.replace('Bearer ', ''), 'base64');
      const credentials = {
        email: buff.toString('utf-8').split(':')[0],
        password: buff.toString('utf-8').split(':')[1],
      };

      if (!credentials.email || !credentials.password) return response.status(401).send({ error: 'Unauthorized' });

      credentials.password = sha1(credentials.password);

      const userExists = await dbClient.Register.findOne(credentials);
      if (!userExists ) {
        return res.status(401).send({ error: 'Unauthorized' }); 
      }
      const token = uuidv4();
      const key = `auth_${token}`;
      console.log(key +" + "+ authHeader);
      // Store the user ID in Redis for 24 hours
      await redisClient.set(key, userExists._id.toString(), 86400);
      return res.status(200).redirect(`/users/me?token=${token}`);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  static async getDisconnect(req, res) {
    try {
      const authToken = req.query.token || null;
      if (!authToken) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Retrieve the user ID from Redis
      const userId = await redisClient.get(`auth_${authToken}`);
      if (!userId) {
        return res.status(401).send({
          error: 'Unauthorized',
        });
      }
  
      const key = `auth_${authToken}`;

      // Delete the token from Redis
      const deleted = await redisClient.del(key);

      if (deleted === 1) {
        return res.status(204).send({ error: 'Logged out successfully' });
      } else {
        return res.status(401).redirect('/loginpage');
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  }
}

export default AuthController;