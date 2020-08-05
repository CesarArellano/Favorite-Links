const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/add', (req,res) => {
  res.render('links/add');
});

router.post('/add', (req,res) => {
  const { title, url, description } = req.body;
  const newLink = {
    title,
    url,
    description
  };
  pool.query('INSERT INTO links set ?',[newLink]) /* Petición asincrona, con await le decimos que va a tomar su tiempo, cuando se ejecute siga con el flujo del programa. */
    .then(() => { res.send('received');})
});
router.get('/', async (req,res) => {
  const links = await pool.query('SELECT * FROM links');
  console.log(links);
  res.render('links/lists',{ links });
});


module.exports = router;