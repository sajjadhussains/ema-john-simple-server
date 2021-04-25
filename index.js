const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mgbtc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(cors());
app.use(bodyParser.json());
console.log(process.env.DB_PASS);



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("emajohnStore").collection("products");
  const orderCollection = client.db("emajohnStore").collection("order");
  app.post('/addProduct',(req,res) => {
    const product=req.body;
    productCollection.insertMany(product)
    .then(result => {
       res.send(result.insertedCount>0);
    })
  })

  app.get('/products',(req,res) => {
    productCollection.find({})
      .toArray((err,documents) => {
          res.send(documents);
      })
  })

  app.get('/product/:key',(req,res) => {
      productCollection.find({key: req.params.key})
      .toArray((err,documents)=>{
          res.send(documents[0]);
      })
  })

  app.post('/productsByKeys',(req,res)=>{
      const productKeys = req.body;
      productCollection.find({key:{$in: productKeys}})
      .toArray((err,documents)=>{
          res.send(documents)
      })
  })

  app.post('/addOrder',(req,res) => {
    const order=req.body;
    orderCollection.insertOne(order)
    .then(result => {
       res.send(result.insertedCount>0);
    })
  })

});


app.get('/',(req,res) => {
    res.send('Thank you so much');
})

app.listen(4000,()=>console.log('listening to 4000 port'));

