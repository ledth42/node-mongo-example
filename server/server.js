const {ObjectID} = require('mongodb');
const _ = require('lodash');
require('./config/config');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate')

const express = require('express');
const bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, async (req, res) => {
  try {

    const newTodo = new Todo({
      text: req.body.text,
      _creator: req.user._id
    });
    const todo = await newTodo.save();
    res.send(todo);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/todos', authenticate, async (req, res) => {
  try {

    const todos = await Todo.find({
      _creator: req.user._id
    });
    res.send({todos});
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/todos/:id', authenticate, async (req, res) => {
  try {

    const {id} = req.params;

    if(!ObjectID.isValid(id)) {
      return res.status(400).send({message: 'Id is not valid'});
    }
    const todo = await Todo.findOne({
      _id: id,
      _creator: req.user._id
    });
    if(!todo) {
      return res.status(400).send({message: 'Id is not found'});
    }
    res.send({todo})
  } catch (e) {
    res.status(400).send({message: 'Error'})
  }
});

app.delete('/todos/:id', authenticate, (req, res) => {
  const {id} = req.params;

  if(!ObjectID.isValid(id)) {
    return res.status(400).send({message: 'Id is not valid'});
  }
  Todo.findByIdAndDelete(id).then((todo) => {
    if(!todo) {
      return res.status(400).send({message: 'Id is not found'});
    }
    res.send({message: 'Delete success', todo});
  }).catch((error) => {
    res.status(400).send({message: 'Error'});
  })
});

app.patch('/todos/:id', authenticate, (req, res) => {
  const {id} = req.params;
  const body = _.pick(req.body, ['text', 'completed']);
  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  if(!ObjectID.isValid(id)) {
    return res.status(400).send({message: 'Id is not valid'});
  }
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(400).send({message: 'Id is not found'});
    }
    res.send({message: 'Delete success', todo});
  }).catch((error) => {
    res.status(400).send({message: 'Error'});
  })
});

// POST /users
app.post('/users/', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const newUser = new User(body);
    const user = await newUser.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }

});

app.get('/users/profile', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.delete('/users/profile/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send(e);
  }
});

app.listen(port, () => {
  console.log(`Server started up at port ${port}`);
});

module.exports = {app};
