const {MongoClient, ObjectID}= require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'TodoApp';

MongoClient.connect(url,{useNewUrlParser: true}, (err, client) => {
  if(err) {
    return console.log('Unable to connect MongoDB server.');
  }
  const db = client.db(dbName);

  db.collection('Todos').find({_id: new ObjectID('5bf4f4b647d3ce05f58f8040')}).toArray().then(docs => {
    console.log('Todos: ', JSON.stringify(docs, undefined, 2));
  }, err => {
    console.log('Unable to fetch Todos')
  })

  client.close();
});
