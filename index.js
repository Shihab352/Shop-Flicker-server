const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const express = require('express')
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000

const app = express()

const corsOptions = {
    origin: ['http://localhost:5173','http://localhost:5174' ],
    credentials : true ,
    optionSuccessStatus : 200,
}

app.use(cors(corsOptions))
app.use(express.json())

app.listen(port , ()=>console.log(`Server Running on Port ${port}`))

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aheao.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {

    const jobsCollection = client.db('ShopFlicker').collection('jobs')
    const bidsCollection = client.db('ShopFlicker').collection('bids')

    // Connect the client to the server	(optional starting in v4.7)
  
    // get all data from db

    app.get('/jobs', async(req, res)=>{
      const result = await jobsCollection.find().toArray();
      res.send(result);
    })

    // Get single data from db using job id 
    app.get('/job/:id' , async(req ,res)=>{
      const id = req.params.id
      console.log(id);
      const query = {_id : new ObjectId(id)}
      const result = await jobsCollection.findOne(query);
      res.send(result);
    })

    // Sava a bid data in db 
    app.post('/bid' , async (req,res)=>{
      const bidData = req.body;
      const result = await bidsCollection.insertOne(bidData);
      res.send(result);
    })
   
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('Hello From ShopFlicker server......')
})

