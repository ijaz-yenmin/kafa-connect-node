const app = require("express")();
var express = require("express");
const http = require("http").createServer(app);
options = {
  cors: true,
  origins: ["http://127.0.0.1:4200"],
};
const io = require("socket.io")(http, options);
const mongoose = require("mongoose");
var Charts = require("./models/chart");
var async = require("async");
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.json());
mongoose.connect("mongodb://localhost/chartdb", {
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
      autoCommit: false,
    }
  );

http.listen(3000, () => {
  console.log("listning to port 3000");
});

var socketMap = [];

io.on("connection", (client) => {
  console.log("Connected", client);
  socketMap.push(client);
  consumer.on("message", function (message) {
    client.emit("request", message.value);
    if (message.value != null) {
      var chrt = JSON.parse(message.value);
      var charts = JSON.parse(chrt.payload.after);
      if (charts != null) {
        dataUpdate();
      }
    }
  });

  client.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

async function dataUpdate() {
  console.log("Socket Emmit");
  var charts = await Charts.find({});
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
