import express from 'express';
import axios from 'axios';
import AppController from '../controllers/AppController.js';
import UsersController from '../controllers/UsersController.js';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('landing-page/index');
});

router.get('/loginpage', (req, res) => {
  res.render('ui/page-login');
});

router.get('/regpage', (req, res) => {
  res.render('ui/page-register');
});

router.get('/status', (req, res) => {
  AppController.getStatus(req, res);
});

router.get('/stats', (req, res) => {
  AppController.getStats(req, res);
});

router.post('/newregistration', (req, res) => {
  UsersController.postNew(req, res);
});

router.use('/connect', (req, res, next) => {
  const data = {
    email: req.body.email,
    password: req.body.password
  };
  // Create a Base64-encoded string for Basic Authentication
  const base64Credentials = Buffer.from(`${data.email}:${data.password}`).toString('base64');
  const authHeader = `Bearer ${base64Credentials}`;
  
  // Set the "Authorization" header in the HTTP request
  req.headers.Authorization = authHeader;
  next();
});

router.post('/connect', (req, res) => {
  AuthController.getConnect(req, res);
});

router.get('/disconnect', (req, res) => {
  AuthController.getDisconnect(req, res);
});

router.get('/users/me', (req, res) => {
  UsersController.getMe(req, res);
});

router.get('/users/profile', (req, res) => {
  UsersController.getProfile(req, res);
});

router.post('/users/changepass', (req, res) => {
  UsersController.getChange(req, res);
});

router.post('/users/makedate', (req, res) => {
  UsersController.postMail(req, res);
});


export default router;