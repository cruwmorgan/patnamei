import express from 'express';


const router = express.Router();

router.get('/', (req, res) => {
  //AppController.getHomepage(req, res);
  res.render('pages/raw');
});


export default router;
