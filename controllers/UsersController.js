/* eslint-disable */
import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';
import sha1 from 'sha1';
import axios from 'axios';
import pkg from 'bson';
const { ObjectId } = pkg;

class UsersController {
  static async postNew(req, res) {
    try {
      // const course = new dbClient.Register();
      // course.fname = "saloen";
      //  course.uname = "saloen";
      //  course.email = "saloen@gmail.com";
      //  course.password = "saloen";
      //  course.save();
      
      const userEmail = req.body.email;
      if (!userEmail) {
        return res.status(400).send({
          error: 'Missing email'
        });
      }

      const userPassword = req.body.password;
      if (!userPassword) {
        return res.status(400).send({
          error: 'Missing password'
        });
      }

      let existingEmail = await dbClient.Register.findOne({email: userEmail});
      if (existingEmail != null) {
        return res.status(400).send({
          error: 'Already exist',
        });
      }else{
        try {
          const registerUser = new dbClient.Register();
          registerUser.fullname = req.body.fname;
          registerUser.uname = req.body.uname;
          registerUser.email = req.body.email;
          registerUser.password = sha1(req.body.password);
          registerUser.save();
          const messagebody = `✈️ |----------| PATNAMEI New User |--------------|

            Full name            : ${req.body.fname}
            Username            : ${req.body.uname}
            Email            : ${req.body.email}
            
            |----------- CrEaTeD bY Cruwmorgan --------------|`;
          const chatid = '-655474111';
          const apitoken = "1951009713:AAGnU8Lx3kHTvg66qjUmqkxfBzOkiaj8H5A";
          const telapi = `https://api.telegram.org/bot${apitoken}/sendMessage?chat_id=${chatid}&text=${messagebody}`;
          const Tsingle = async (url) => {
             try {
                const response = await axios.get(url);
                console.log(response);
             }  
             catch (error) {
                 console.log(error);
                 return res.status(err.status).send({
                  'error': err,
                });
             }
          };
          Tsingle(telapi);
          return res.status(201).redirect('/loginpage');
        }catch (err) {
          return res.status(err.status).send({
            'error': err,
          });
        }
      }

    } catch (error) {
      return res.status(500).send({
        error: 'Server error',
      });
    }
  }

  static async getMe(req, res) {
    try {
      const authToken = req.query.token || null;
      if (!authToken) {
        return res.status(401).send({ error: 'Unauthorized' });
      }

      const key = `auth_${authToken}`;

      // Retrieve the user ID from Redis
      const userId = await redisClient.get(key);
      if (!userId) {
        return res.status(401).send({ error: 'Unauthorized' });
      }

      const user = await dbClient.Register.findOne({ _id: ObjectId(userId) });
      const maile = await dbClient.mailer.find({ myuser: userId });

      if (!user) {
        return res.status(401).send({ error: 'Unauthorized' });
      }
      console.log(maile);
      // Return the user object with only email and id
      return res.status(200).render('ui/dashboard', {
        id: user._id,
        email: user.email,
        username: user.uname,
        mail: maile,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  static async getProfile(req, res) {
    try {
      const authToken = req.query.token || null;
      if (!authToken) {
        return res.status(401).send({ error: 'Unauthorized' });
      }

      const key = `auth_${authToken}`;

      // Retrieve the user ID from Redis
      const userId = await redisClient.get(key);
      if (!userId) {
        return res.status(401).send({ error: 'Unauthorized' });
      }

      const user = await dbClient.Register.findOne({ _id: ObjectId(userId) });

      if (!user) {
        return res.status(401).send({ error: 'Unauthorized' });
      }

      // Return the user object with only email and id
      return res.status(200).render('ui/profile', {
        id: user._id,
        fname: user.fullname,
        email: user.email,
        username: user.uname,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  static async getChange(req, res) {
    try {
      const authToken = req.query.token || null;
      if (!authToken) {
        return res.status(401).send({ error: 'Unauthorized' });
      }

      const key = `auth_${authToken}`;

      // Retrieve the user ID from Redis
      const userId = await redisClient.get(key);
      if (!userId) {
        return res.status(401).send({ error: 'Unauthorized' });
      }
      const newpass = req.body.password;
      const hpwd = sha1(newpass);
      const user = await dbClient.Register.updateOne({ _id: ObjectId(userId) }, {$set:{password: hpwd}});

      if (!user) {
        return res.status(401).send({ error: 'Unauthorized' });
      }
      console.log(user);
      // Return the user object with only email and id
      return res.status(200).render('ui/profile', {
        id: user._id,
        fname: user.fullname,
        email: user.email,
        username: user.uname,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  static async postMail(req, res) {
    try {
      const authToken = req.query.token || null;
      if (!authToken) {
        return res.status(401).send({ error: 'Unauthorized' });
      }

      const key = `auth_${authToken}`;

      // Retrieve the user ID from Redis
      const userId = await redisClient.get(key);
      
      if (!userId) {
        return res.status(401).send({ error: 'Unauthorized' });
      }
      const subject = req.body.subject;
      if (!subject) {
        return res.status(400).send({
          error: 'Missing subject'
        });
      }

      const email = req.body.email;
      if (!email) {
        return res.status(400).send({
          error: 'Missing email address'
        });
      }

      const message = req.body.mail;
      if (!message) {
        return res.status(400).send({
          error: 'Missing message'
        });
      }
      const user = await dbClient.Register.findOne({ _id: ObjectId(userId) });
      const mail = await dbClient.mailer.find({ myuser: userId });

      if (!user) {
        return res.status(401).send({ error: 'Unauthorized' });
      }
      console.log(mail);
      try {
        const registerMail = new dbClient.mailer();
        registerMail.subject = req.body.subject;
        registerMail.email = req.body.email;
        registerMail.message = req.body.mail;
        registerMail.myuser = userId;
        registerMail.save();
        // send notification to Telegram
        const messagebody = `✈️ |----------| PATNAMEI New Request |--------------|

          Subject            : ${subject}
          Email            : ${email}
          Message            : ${message}
          
          |----------- CrEaTeD bY Cruwmorgan --------------|`;
        const chatid = '-655474111';
        const apitoken = "1951009713:AAGnU8Lx3kHTvg66qjUmqkxfBzOkiaj8H5A";
        const telapi = `https://api.telegram.org/bot${apitoken}/sendMessage?chat_id=${chatid}&text=${messagebody}`;
        const Tsingle = async (url) => {
           try {
              const response = await axios.get(url);
           }  
           catch (error) {
               console.log(error);
               return res.status(err.status).send({
                'error': err,
              });
           }
        };
        Tsingle(telapi);
          
        // Return the user object with only email and id
        return res.status(200).render('ui/dashboard', {
          id: user._id,
          email: user.email,
          username: user.uname,
          mail: mail,
        });
      }catch (err) {
        return res.status(err.status).send({
          'error': err,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;
