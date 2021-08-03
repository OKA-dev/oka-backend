const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://tip_admin:0ZJi6bTUfNCDncDO@devcluster0.u7md0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(async (err) => {
  const collection = client.db("deliveries").collection("countries");
  // perform actions on the collection object
  const countries = require('./countries')
  const options = { ordered: true }
  const result = await collection.insertMany(countries, options)
  console.log('countries inserted')
  client.close();
});