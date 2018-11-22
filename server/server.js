const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const express = require('express');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const newTodo = new Todo({
    text: req.body.text,
  });
  newTodo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({
      todos
    });
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos/:id', (req, res) => {
  const {id} = req.params;

  if(!ObjectID.isValid(id)) {
    return res.status(400).send({message: 'Id is not valid'})
  }
  Todo.findById(id).then((todo) => {
    if(!todo) {
      return res.status(400).send({message: 'Id is not found'})
    }
    res.send({todo})
  }).catch((error) => {
    res.status(400).send({message: 'Error'})
  })
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

module.exports = {app};
