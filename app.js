// app.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connection = require('./connection');
const { urlencoded } = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',(req, res) =>{
    res.status(200).json({ message: 'Hello World!' });
  });

app.post('/bookmarks', (req, res) =>{
    const { url, title } = req.body;
    if (!url || !title) {
        return res.status(422).json({"error": "required field(s) missing"});
    } 
    const formData = req.body 
    connection.query('INSERT INTO bookmark SET ?', formData, (err, results) => {
        if (err) return res.status(500).json({ error: err.message, sql: err.sql }); 
        connection.query('SELECT * FROM bookmark where id = ?', results.insertId, (err, results) => {
            if (err) return res.status(500).json({ error: err.message, sql: err.sql });
            return res.status(201).json(results[0]);
        })
    })
});

app.get('/bookmarks', (req, res) =>{
    const bookmarksId = req.params.id
    connection.query('SELECT * FROM bookmark', (err, results) => {
        return res.status(201).json(results);
    })        
});

app.get('/bookmarks/:id', (req, res) => {
    const bookmarksId = req.params.id
    connection.query('SELECT * FROM bookmark WHERE id = ?', bookmarksId, (err, results) => {
        if (err) {
        res.status(500).send(`Erreur lors de la récupération d'un coffret`);
      } 
      if (results.length === 0) {
        return res.status(404).json({ error: 'Bookmark not found' });
      } else {
        res.json(results[0]);
      }
    });
  });

app.listen(3000, (err) => {
    if (err) {
      throw new Error('Something bad happened...');
    }
    console.log(`Server is listening on 3000`);
  });

module.exports = app;