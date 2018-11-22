const {MongoClient, ObjectID}= require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'TodoApp';

MongoClient.connect(url,{useNewUrlParser: true}, (err, client) => {
  if(err) {
    return console.log('Unable to connect MongoDB server.');
  }
  const db = client.db(dbName);

  // delete many
  db.collection('Todos').deleteMany({text: 'Eat lunch'}).then(result => {
    console.log('Delete many result: ', JSON.stringify(result, undefined, 2));
  }, err => {
    console.log('Unable to deleteMany Todos')
  })

  // findOneAndDelete
  db.collection('Users').findOneAndDelete({_id: new ObjectID('5bf4f4b647d3ce05f58f8041')}).then(result => {
    console.log('User delete: ', JSON.stringify(result, undefined, 2));
  }, err => {
    console.log('Unable to delete user')
  })

  client.close();
});
