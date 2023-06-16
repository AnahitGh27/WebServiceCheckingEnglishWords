//const { MongoClient } = require('mongodb');
const express = require('express');
const { connectToDb, getDb } = require('./db');
const fs = require('fs');
const readline = require('readline');
const { normalizeWord } = require('./Normalize');
const { testWords } = require('./testWords');


const app = express();
app.use(express.json());
app.use(express.text());

const port = 3033;
//const url = "mongodb://127.0.0.1:27017/words_alpha";

let db;

connectToDb((err) => {
  if (!err) {
      app.listen(port, () => {
          console.log(`app listening on port ${port}`);
      });
      db = getDb();
  }
})
  
  app.post('/api/collection', (req, res) => {
    const wordsArray = [];
  
    const readStream = fs.createReadStream('words_alpha.txt');
    const rl = readline.createInterface({
      input: readStream,
      output: process.stdout,
      terminal: false
    });
  
    rl.on('line', (word) => {
      wordsArray.push({ word: word });
    });
  
    rl.on('close', () => {
      db.collection('words')
        .insertMany(wordsArray)
        .then((result) => {
          res.status(201).json(result);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ err: 'Could not create new documents.' });
        });
    });
  });

  app.get('/api/search', (req, res) => {
    let searchWord = req.query.w;
    console.log(searchWord);
      db.collection('words')
      .findOne({word: `${searchWord}`})
      .then((doc) => {
        if (doc) {
            res.status(200).json({response: `${searchWord} word is found`});
          } else {
            res.status(404).json({ error: 'No matching word is found' });
          }
      })
      .catch((err) => {
        res.status(500).json({error: 'Could not fetch the document'})
      })
  })

  app.post('/api/normalize', (req, res) => {
    const word = req.body;
    const resWord = normalizeWord(word);
    res.send(`
        Sent word: ${word}
        Normilized word: ${resWord}
    `);
  });

  app.get('/api/test', (req, res) => {
    const words = [
        'Apples', 'Cats', 'Dogs', 'Babies','BoX15es', 
        'Cities', 'Glas#$%^&ses', 'Heroes', 'Keys', 'Ladies', 
        'Mice', 'Men', 'Women', 'Sheep', 'Teeth',
        'Fish', 'G#^%eese', 'Wolves', 'Tomatoes'
    ];
    const result = testWords(words);
    res.send(`
        Words for testing: 
        ${words}
        Results: 
        ${result}
    `);
  });