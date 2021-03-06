const express = require('express')
const app = express()
const port = 3000
var cors = require('cors');
var ObjectId = require('mongodb').ObjectID;

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


app.get('/getallbudget', (req, res) => {
  let arr = [];
  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('Budgets').find();
    cursor.each(function (err, item) {
      if (item == null) {
        res.send(arr);
      }
      arr.push(item);
    });
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Budgets').find();
      cursor.each(function (err, item) {
        if (item == null) {
          res.send(arr);
        }
        arr.push(item);
      });
    })
  };
})


app.get('/updatebudget', (req, res) => {
  // http://localhost:3000/updatebudget?amount=100
  var category = req.query.category ? req.query.category : "Food";
  var amount = req.query.amount ? req.query.amount : 0;
  var currency = req.query.currency ? req.query.currency : "Aud";
  let requestJson = {
    "Category": category,
    "Amount": parseInt(amount),
    "Currency": currency,
  }
  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('Budgets');
    cursor.findOne({"Category": category}, {$exists: true}, function(err, res){
        if (!res) {
          cursor.insertOne(requestJson);
        } else {
          console.log(res + " : responese\n")
          cursor.findOneAndUpdate({"Category": category}, { $inc: {"Amount": parseInt(amount)} });
        }
    });
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Budgets');
      cursor.findOne({"Category": category}, {$exists: true}, function(err, res){
        console.log(res + " : responese\n")
        if (!res) {
          cursor.insertOne(requestJson);
        } else {
          cursor.findOneAndUpdate({"Category": category}, { $inc: {"Amount": parseInt(amount)} });
        }
    });
    });
  }
  res.send("done");
})


function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

app.get('/getallcategory', (req, res) => {
  let arr = [];
  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('Spendings').find();
    cursor.each(function (err, item) {
      if (item == null) {
        res.send(arr.filter(onlyUnique));
      }
        if (item){
          arr.push(item["Category"])
        }
    });
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Spendings').find();
      cursor.each(function (err, item) {
        if (item == null) {
          res.send(arr.filter(onlyUnique));
        }
        if (item){
          arr.push(item["Category"])
        }
      });
    })
  };
})


// collection.findOne({"_id": new ObjectId(id)}, function(err, doc) {




app.get('/getallusers', (req, res) => {
  let arr = [];
  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('Users').find();
    cursor.each(function (err, item) {
      if (item == null) {
        res.send(arr);
      }
      arr.push(item);
    });
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Users').find();
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
  var isoString = req.query.time ? req.query.time : now.toISOString();
  let requestJson = {
    "Category": category,
    "Amount": amount,
    "Currency": currency,
    "Time": isoString
  }
  if (client.isConnected()) {
    // collection.findOne({"_id": new ObjectId(id)}, function(err, doc) {
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




app.get('/deletespending', (req, res) => {
  // http://localhost:3000/deletespending?id=5f8f8edaa315790067f562ed
  var id = req.query.id;
 
  if (!id){res.send("id required")}
  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('Spendings');
    cursor.remove({ _id: new ObjectId(id)});
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Spendings');
      cursor.remove({ _id: new ObjectId(id)});
    });
  }
  res.send("done");
})

app.get('/updateuser', (req, res) => {
  // http://localhost:3000/spending?category=Clothes&amount=50
  if (!req.query.userid){return res.send("object id required")}
  var userID = req.query.userid ? req.query.userid : 1;
  if (!req.query.objid){return res.send("object id required")}
  var requestID = req.query.objid;
  if (client.isConnected()) {
    var cursor = client.db("PiggyFund").collection('Users');
    cursor.findOneAndUpdate({"UserID": parseInt(userID)}, { $push: {"Spendings": new ObjectId(requestID)} });
  } else {
    client.connect(err => {
      var cursor = client.db("PiggyFund").collection('Users');
      cursor.findOneAndUpdate({"UserID": parseInt(userID)}, { $push: {"Spendings": new ObjectId(requestID)} });
    });
  }
  res.send("done");
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})