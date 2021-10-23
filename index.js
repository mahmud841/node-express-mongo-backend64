const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
// const port = process.env.PORT || 5000;
const port = 5000;

//middleware use hobe app er niche 
app.use(cors());
app.use(express.json());
//user: mydbuser1 password: KgrfLzbzBV1sgIIa Current my ip :155.94.198.101

/*  Working Style-1 
const uri = "mongodb+srv://mydbuser1:KgrfLzbzBV1sgIIa@cluster0.kjooh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("foodMinister").collection("users");
  // perform actions on the collection object
  console.log('Hitting the Database ');
  // const user = {name: 'Mahmud Khan', email: 'khan@gmail.com', phone:'015678990988'};
  const user = {name: 'Salman Khan', email: 'khan123@gmail.com', phone:'015678990976'};
  collection.insertOne(user)
  .then( () => {
    console.log('insert success hoyese ');
    
  })
  // console.error(err);
  
  
  // client.close();
}); */

// Working Style-2 await async system 
const uri = "mongodb+srv://mydbuser1:KgrfLzbzBV1sgIIa@cluster0.kjooh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
  try {
    await client.connect();
    const database = client.db("foodMinister");
    const usersCollection = database.collection("users");
    // create a document to insert
  /*   const doc = {
      name: "Special One",
      email: "specialmail@gmail.com",
    }
    const result = await usersCollection.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`) */;




    //GEt API 
    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    })


app.get('/users/:id',async (req,res) =>{
  const id = req.params.id;
  const query = {_id: ObjectId(id)};
  const user = await usersCollection.findOne(query);
  console.log('loaded user with id ',id);
  res.send(user);
  
})


    //POST API toiri korbo 
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      // console.log('got the new user ', req.body);
      // console.log('added the user ', result);
      res.json(result);

      /*    console.log('hitting the post',req.body);
         res.send('hit the post') */
    });

// Update Api 
app.put('/users/:id', async(req,res) =>{
  const id = req.params.id;
  const updatedUser = req.body;
  const filter = {_id: ObjectId(id)};
  const options = {upsert: true};
  const updateDoc = {
    $set: {
      name: updatedUser.name,
      email: updatedUser.email
    },
  };
const result = await usersCollection.updateOne(filter, updateDoc, options)
  console.log('updating user ',req);
  // res.send('updatinf not dating')
  res.json(result);
  
  
})


    //Delete Api 
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      console.log('deleting user id ',result);
      // res.json(1);
      res.json(result);

    })


  } finally {
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Running my CRUD server');
});

app.listen(port, () => {
  console.log('Running CRUD Server on port', port);

})