import redisClient from '../utils/redis.js';
import dbClient from '../utils/db.js';

class AppController {
  static getStatus(req, res) {
    const status = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    return res.status(200).send(status);
  }

  static async getStats(req, res) {
    const stats = {
      users: await dbClient.nbUsers(),
      mails: await dbClient.nbMails(),
    };
    return res.status(200).send(stats);
  }
}


export default AppController;
