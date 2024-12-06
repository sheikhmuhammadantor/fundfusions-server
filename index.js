const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// ? Middleware:
app.use(cors());
app.use(express.json());


// ! Work With - MongoDB ;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@assignment.6gi81.mongodb.net/?retryWrites=true&w=majority&appName=Assignment`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const campDB = client.db("FoundFusions").collection('campaign');
        const donationDB = client.db("FoundFusions").collection('donated collection');

        // * Work With Api/Frontend Route's;
        app.post('/addCampaign', async (req, res) => {
            console.log(req.body);
            const camp = req.body;
            const result = await campDB.insertOne(camp);
            res.send(result)
        })

        app.get('/campaigns', async (req, res) => {
            const result = await campDB.find().toArray();
            res.send(result);
        })

        app.get('/campaign/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await campDB.findOne(query);
            res.send(result);
        }).post('/campaign/:id', async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await donationDB.insertOne(data);
            res.send(result);
        })
   
        app.get('/myDonations', async (req, res) => {
            const email = req.query.email;
            const query = {email: email}
            const result = await donationDB.find(query).toArray();
            res.send(result);
        })
        
        app.get('/myCampaign', async (req, res) => {
            const email = req.query.email;
            const query = {email: email}
            const result = await campDB.find(query).toArray();
            res.send(result);
        })

        app.delete('/myCampaign/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await campDB.deleteOne(query);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
