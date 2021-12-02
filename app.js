const app = require("express")();
var express = require("express");
const http = require("http").createServer(app);
options = {
  cors: true,
  origins: ["http://127.0.0.1:4200"],
};
const io = require("socket.io")(http, options);
const mongoose = require("mongoose");
var users = require("./models/chart");
var async = require("async");
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.json());
mongoose.connect("mongodb://34.93.71.234:27017/testdb?replicaSet=rs0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var kafka = require("kafka-node");
var Consumer = kafka.Consumer,
  client = new kafka.KafkaClient("localhost:9092"),
  consumer = new Consumer(
    client,
    [{ topic: "mongo1.testdb.users", partition: 0 }],
    {
      autoCommit: true,
    }
  );

http.listen(3000, () => {
  console.log("listning to port 3000");
});

var socketMap = [];

io.on("connection", (client) => {
  console.log("Connected", client);
  socketMap.push(client);

  // client.on("disconnect", () => {
  //   console.log("Client disconnected");
  // });
});

consumer.on("message", function (message) {
  client.emit("request", message.value);
  if (message.value != null) {
    dataUpdate();
  }
});

async function dataUpdate() {
  console.log("Socket Emmit");
  var charts = await users.aggregate([
    {
      $group: {
        _id: "null",
        january: {
          $sum: "$january",
        },
        february: {
          $sum: "$february",
        },
        march: {
          $sum: "$march",
        },
        april: {
          $sum: "$april",
        },
        may: {
          $sum: "$may",
        },
        june: {
          $sum: "$june",
        },
        july: {
          $sum: "$july",
        },
        august: {
          $sum: "$august",
        },
      },
    },
  ]);
  console.log(charts);
  console.log(charts.length);
  for (let socketMapObj of socketMap) {
    if (charts.length > 0) {
      socketMapObj.emit("dataUpdate", [
        charts[0].january,
        charts[0].february,
        charts[0].march,
        charts[0].april,
        charts[0].may,
        charts[0].june,
        charts[0].july,
        charts[0].august,
      ]);
    }
  }
}
