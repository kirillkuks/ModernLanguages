const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 8000;

const model = require('../Lab/model.js');

var file = 'data/books.txt';
var idFile = 'data/id.id';
var id = 0;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Simple CRUD controller');
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);

    fs.readFile(idFile, 'utf-8', (err, _id) => {
        if (err) {
            console.error('Load is error');
        }

        id = Number(_id);
    });
});

app.post('/books', (req, res) => {
    if (!req.body.title || !req.body.author) {
        return res.status(400).send({
            message: 'Invalid request'
        });
    }

    ++id;

    let bookInfo = model.RequestToString(req.body, id);

    fs.appendFile(file, bookInfo + '\n', err => {
        if (err) {
            return res.status(500).send({
                message: 'Saving book data error'
            });
        }
        return;
    });

    fs.writeFile(idFile, id.toString(), err => {
        if (err) {
            console.error(err);
        }
        return res.send('Book was successfully added');
    });
});

app.get('/books', (req, res) => {
    res.sendFile(__dirname + '/' + file);
});

app.get('/books/:id', (req, res) => {
    fs.readFile(file, 'utf-8', (err, filedata) => {
        if (err) {
            return res.status(500).send({
                message: 'Loading books data error'
            });
        }

        let bookInfoJson = model.FindBookById(filedata, req.params.id);

        if (bookInfoJson == null) {
            return res.status(400).send({
                message: 'There is not book with such id'
            });
        }

        return res.json(bookInfoJson);
    });
});

app.put('/books/:id', (req, res) => {
    if (!req.body.title || !req.body.author) {
        return res.status(400).send({
            message: 'Invalide request'
        });
    }

    fs.readFile(file, 'utf-8', (err, filedata) => {
        if (err) {
            return res.status(500).send({
                message: 'Loading books data error'
            });
        }

        let newBookInfo = model.RequestToString(req.body, parseInt(req.params.id));

        let bookInfo = model.FindBookById(filedata, req.params.id, false);

        if (bookInfo == null) {
            return res.status(400).send({
                message: 'There is not book with such id'
            });
        }

        fs.writeFile(file, filedata.replace(bookInfo, newBookInfo), 'utf-8', (err) => {
            if (err) {
                return res.status(500).send({
                    message: 'Saving updates error'
                });
            }
        });

        res.send(`Book\'s node with id = ${req.params.id} was successfully updated`);
    });
});

app.delete('/books/:id', (req, res) => {
    fs.readFile(file, 'utf-8', (err, filedata) => {
        if (err) {
            return res.status(500).send({
                message: 'Loading books data error'
            });
        }

        let newBooksData = model.DeleteBookById(filedata, req.params.id);

        if (newBooksData == null) {
            return res.status(400).send({
                message: 'There is not book with such id'
            });
        }

        fs.writeFile(file, newBooksData, 'utf-8', (err) => {
            if (err) {
                return res.status(500).send({
                    message: 'Saving updates error'
                });
            }
        });

        return res.send(`Book\'s node with id = ${req.params.id} was successfully deleted`);
    });
});
