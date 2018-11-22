const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {Todo} = require('./../models/todo');
const {app} = require('./../server');

const todos = [{_id: new ObjectID(),
    text: 'First test todo'
  }, {
    _id: new ObjectID(),
    text: 'Second test todo'
  }];
beforeEach((done) => {
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(todos)
  })
    .then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((error, res) => {
        if(error) {
          return done(error);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();

        }).catch(error => done(error))
      })
  });

  it('should not create new todo with invalid params', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((error, res) => {
        if(error) {
          return done(error);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();

        }).catch(error => done(error))
      })
  })
});

describe('GET /todos', ()  => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done)
  })
});

describe('GET /todos/:id', ()  => {
  it('should get invalid id', (done) => {
    request(app)
      .get('/todos/1234')
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({message: 'Id is not valid'});
      })
      .end(done)
  })
  it('should get id not found', (done) => {
    const hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({message: 'Id is not found'});
      })
      .end(done)
  })
  it('should return todo', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo).toHaveProperty('text', 'First test todo');
      })
      .end(done)
  })
});

describe('DELETE /todos/:id', ()  => {
  it('should get invalid id', (done) => {
    request(app)
      .delete('/todos/1234')
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({message: 'Id is not valid'});
      })
      .end(done)
  })
  it('should get id not found', (done) => {
    const hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({message: 'Id is not found'});
      })
      .end(done)
  })
  it('should remove a todo successful', (done) => {
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {

        expect(res.body).toHaveProperty("message", "Delete success");
      })
      .end((error, res) => {
        if(error) {
          return done(error);
        }

        Todo.findById(todos[0]._id.toHexString()).then((todo) => {
          expect(todo).toBeFalsy();
          done();

        }).catch(error => done(error))
      })
  })
});

describe('PATCH /todos/:id', ()  => {
  it('should get invalid id', (done) => {
    request(app)
      .patch('/todos/1234')
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({message: 'Id is not valid'});
      })
      .end(done)
  })
  it('should get id not found', (done) => {
    const hexId = new ObjectID().toHexString();
    request(app)
      .patch(`/todos/${hexId}`)
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({message: 'Id is not found'});
      })
      .end(done)
  })
  it('should update successful', (done) => {
    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .send({text: 'new todo', completed: true})
      .expect(200)
      .expect((res) => {

        expect(res.body.todo).toHaveProperty("text", "new todo");
      })
      .end((error, res) => {
        if(error) {
          return done(error);
        }

        Todo.findById(todos[0]._id.toHexString()).then((todo) => {
          expect(todo).toBeTruthy();
          done();

        }).catch(error => done(error))
      })
  })
  it('should clear completedAt when todo is not complete', (done) => {
    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .send({text: 'todo not completed', completed: false})
      .expect(200)
      .expect((res) => {

        expect(res.body.todo).toHaveProperty("text", "todo not completed");
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeNull();
      })
      .end(done);
  })
});
