const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const port = 8000;

app.get('/', (req, res) => {
    res.send('My Database is running')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@database.1n8y8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db(`${process.env.DB_NAME}`).collection("Products");
    const ordersCollection = client.db(`${process.env.DB_NAME}`).collection("Orders");

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        productsCollection.insertOne(product)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, docs) => {
                res.send(docs);
            })
    })

    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, docs) => {
                res.send(docs[0]);
            })
    })

    app.post('/productsByKeys', (req, res) => {
        productsCollection.find({ key: { $in: req.body } })
            .toArray((err, docs) => {
                res.send(docs)
            })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
});


app.listen(process.env.PORT || port)