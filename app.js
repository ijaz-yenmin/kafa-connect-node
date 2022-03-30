const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

// Connection URL
const url =
  "mongodb://protonroot:s65ds2d4asd23a5a6s5d4a@65.1.94.198:30001/?authSource=admin&replicaSet=rs0&retryWrites=true";

// Database Name
const dbName = "proton_dev";
const options = {
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 75000,
  keepAlive: true,
};

// Use connect method to connect to the server
MongoClient.connect(url, function (err, db) {
  if (err) {
    throw err;
  }

  console.log("Database connection successful");

  var dbo = db.db("proton_dev");
  var cursor = dbo
    .collection("users")
    .find()
    .toArray(function (err, items) {
      console.log(JSON.stringify(items));
      // res.send(items);
    });
  db.close();
});
