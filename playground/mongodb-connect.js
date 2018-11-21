const {MongoClient, ObjectID}= require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'TodoApp';

MongoClient.connect(url, (err, client) => {
  if(err) {
    return console.log('Unable to connect MongoDB server.');
  }
  const db = client.db(dbName);

  db.collection('Todos').insertOne({
    text: 'Something to do ',
    completed: false
  }, (err, result) => {
    if(err) {
      return console.log('Unable to create new todo');
    }
    console.log('New todo: ', JSON.stringify(result.ops, undefined, 2));
    console.log(result.ops[0]._id.getTimestamp());
  });

  db.collection('Users').insertOne({
    name: 'LeDTH ',
    age: 33,
    location: 'Hanoi - Vietnam'
  }, (err, result) => {
    if(err) {
      return console.log('Unable to create new user');
    }
    console.log('New todo: ', JSON.stringify(result.ops, undefined, 2));
  });

  client.close();
});
