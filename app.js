const app = require("express")();
var express = require("express");
const http = require("http").createServer(app);
const options = {
  cors: true,
  origins: ["http://127.0.0.1:4200"],
};
var io = require("socket.io")(http, options);
const axios = require("axios").default;
// const mongoose = require("mongoose");
// var users = require("./models/chart");
var async = require("async");
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.json());

var kafka = require("kafka-node");
var Consumer = kafka.Consumer,
  client = new kafka.KafkaClient("localhost:9092"),
  consumer = new Consumer(
    client,
    [{ topic: "mongo-connect.proton_dev.users", partition: 0 }],
    {
      autoCommit: true,
    }
  );

http.listen(3000, () => {
  console.log("listning to port 3000");
});

// io.on("connection", (socket) => {
//   socketMap.push(socket);
// });

var socketMap = [];
consumer.on("message", function (message) {
  console.log("trigger kafka");
  sendGetRequest();
});

const sendGetRequest = async () => {
  try {
    const resp = await axios.get("http://34.93.111.74:8080/users", {
      headers: {
        authorization: "Basic YWRtaW46c2VjcmV0",
      },
    });

    console.log(resp.data);
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

sendGetRequest();

// async function dataUpdate() {
//   console.log("Socket Emmit");
//   var charts = await users.aggregate([
//     {
//       $group: {
//         _id: "null",
//         january: {
//           $sum: "$january",
//         },
//         february: {
//           $sum: "$february",
//         },
//         march: {
//           $sum: "$march",
//         },
//         april: {
//           $sum: "$april",
//         },
//         may: {
//           $sum: "$may",
//         },
//         june: {
//           $sum: "$june",
//         },
//         july: {
//           $sum: "$july",
//         },
//         august: {
//           $sum: "$august",
//         },
//       },
//     },
//   ]);
//   console.log(charts);
//   console.log(charts.length);
//   for (let socketMapObj of socketMap) {
//     if (charts.length > 0) {
//       io.sockets.emit("dataUpdate", [
//         charts[0].january,
//         charts[0].february,
//         charts[0].march,
//         charts[0].april,
//         charts[0].may,
//         charts[0].june,
//         charts[0].july,
//         charts[0].august,
//       ]);
//     }
//   }
// }
