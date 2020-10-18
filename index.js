const express = require('express')
const app = express()
const port = 3000
var cors = require('cors');

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://test:test@cluster0.cbjkw.mongodb.net/PiggyFund?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true
});

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/getall', (req, res) => {
  let arr = [];
  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('Spendings').find();
    cursor.each(function (err, item) {
      if (item == null) {
        res.send(arr);
      }
      arr.push(item);
    });
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Spendings').find();
      cursor.each(function (err, item) {
        if (item == null) {
          res.send(arr);
        }
        arr.push(item);
      });
    })
  };

})


app.get('/spending', (req, res) => {
  // http://localhost:3000/spending?category=Clothes&amount=50
  var category = req.query.category ? req.query.category : "Food";
  var amount = req.query.amount ? req.query.amount : "0";
  var currency = req.query.currency ? req.query.currency : "Aud";
  var now = new Date();
  var isoString = now.toISOString();
  let arr = [];
  let requestJson = {
    "category": category,
    "amount": amount,
    "currency": currency,
    "Time": isoString
  }
  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('Spendings');
    cursor.insertOne(requestJson);
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Spendings');
      cursor.insertOne(requestJson);
    });
  }
  res.send("done");
})




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})