const {MongoClient, ObjectID}= require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'TodoApp';

MongoClient.connect(url,{useNewUrlParser: true}, (err, client) => {
  if(err) {
    return console.log('Unable to connect MongoDB server.');
  }
  const db = client.db(dbName);


  // findOneAndUpdate
  db.collection('Users').findOneAndUpdate({_id: new ObjectID('5bf50811b4fde9ac756d873c')},
    {$set: {'name': 'James'}, $inc: { age: 1 }},{returnOriginal: false}).then(result => {
    console.log('User updated: ', JSON.stringify(result, undefined, 2));
  }, err => {
    console.log('Unable to update user', err);
  })

  client.close();
});
