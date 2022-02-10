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
  client = new kafka.KafkaClient("127.0.0.1:9092"),
  consumer = new Consumer(
    client,
    [
      { topic: "proton_server.proton_dev.users", partition: 0 },
      { topic: "proton_server.proton_dev.aw-watcher-timeline", partition: 0 },
    ],
    {
      autoCommit: true,
    }
  );

http.listen(3000, () => {
  console.log("listning to port 3000");
});
var socketMap = [];
var activiesUserId = null;
io.on("connection", (socket) => {
  socketMap.push(socket);

  socket.on("test", (val) => {
    console.log(val);
    activiesUserId = val;
  });
});

let dtLocal = new Date();
var last = new Date(dtLocal.getTime() - 7 * 24 * 60 * 60 * 1000);
var startDate =
  last.toISOString().replace("T", " ").substr(0, 19).split(" ")[0] +
  "T00:00:00Z";
var lastDate =
  dtLocal.toISOString().replace("T", " ").substr(0, 19).split(" ")[0] +
  "T00:00:00Z";

consumer.on("message", function (message) {
  console.log("trigger kafka");
  if (message.value != null) {
    var data = JSON.parse(message.value);
    var record = JSON.parse(data.payload.after);
    if (record != null) {
      var data = {
        orgId: record.orgID,
        userId: record.uid,
      };
      console.log(data);
      io.sockets.emit("most-used-app", data);
      io.sockets.emit("overview-dashboard", data);
      io.sockets.emit("activies-app", data);
      io.sockets.emit("dashboard-afk-app", data);
      io.sockets.emit("top-perform-app", data);
      io.sockets.emit("user-count", data);
      io.sockets.emit("user-activity", data);
    }
  }
});

// const activityApp = async () => {
//   try {
//     const resp = await axios.get(
//       "http://34.93.191.136:8080/aw-watcher-timeline/_aggrs/activities?avars={'start':'" +
//         startDate +
//         "','end':'" +
//         lastDate +
//         "'}",
//       {
//         headers: {
//           authorization: "Basic YWRtaW46cHJ0bnlubW4=",
//         },
//       }
//     );
//     io.sockets.emit("activies-app", resp.data);

//     // console.log(resp.data);
//   } catch (err) {
//     // Handle Error Here
//     console.error(err);
//   }
// };

// const activityAppByUserId = async () => {
//   try {
//     const resp = await axios.get(
//       "http://34.93.191.136:8080/aw-watcher-timeline/_aggrs/activities-for-activities?avars={'id':'" +
//         activiesUserId +
//         "','start':'" +
//         startDate +
//         "','end':'" +
//         lastDate +
//         "'}",
//       {
//         headers: {
//           authorization: "Basic YWRtaW46cHJ0bnlubW4=",
//         },
//       }
//     );
//     io.sockets.emit("activites-active-widget", resp.data);

//     // console.log(resp.data);
//   } catch (err) {
//     // Handle Error Here
//     console.error(err);
//   }
// };

// const mostUsedAPP = async () => {
//   try {
//     const resp = await axios.get(
//       "http://34.93.191.136:8080/aw-watcher-timeline/_aggrs/most-used-apps?avars={'start':'" +
//         startDate +
//         "','end':'" +
//         lastDate +
//         "'}",
//       {
//         headers: {
//           authorization: "Basic YWRtaW46cHJ0bnlubW4=",
//         },
//       }
//     );
//     io.sockets.emit("most-used-app", resp.data);

//     // console.log(resp.data);
//   } catch (err) {
//     // Handle Error Here
//     console.error(err);
//   }
// };

// const mostUsedAPPById = async () => {
//   try {
//     const resp = await axios.get(
//       "http://34.93.191.136:8080/aw-watcher-timeline/_aggrs/most-used-apps-activities?avars={'id':'" +
//         activiesUserId +
//         "','start':'" +
//         startDate +
//         "','end':'" +
//         lastDate +
//         "'}",
//       {
//         headers: {
//           authorization: "Basic YWRtaW46cHJ0bnlubW4=",
//         },
//       }
//     );
//     io.sockets.emit("activities-most-used-app", resp.data);

//     // console.log(resp.data);
//   } catch (err) {
//     // Handle Error Here
//     console.error(err);
//   }
// };

// const afkApp = async () => {
//   try {
//     const resp = await axios.get(
//       "http://34.93.191.136:8080/aw-watcher-afk/_aggrs/afk?avars={'start':'" +
//         startDate +
//         "','end':'" +
//         lastDate +
//         "'}",
//       {
//         headers: {
//           authorization: "Basic YWRtaW46cHJ0bnlubW4=",
//         },
//       }
//     );
//     io.sockets.emit("dashboard-afk-app", resp.data);
//     // console.log(resp.data);
//   } catch (err) {
//     // Handle Error Here
//     console.error(err);
//   }
// };

// //
// //
// // firstTreeNode

// const afkAppById = async () => {
//   try {
//     const resp = await axios.get(
//       "http://34.93.191.136:8080/aw-watcher-afk/_aggrs/afk-activities?avars={'id':'" +
//         activiesUserId +
//         "','start':'" +
//         startDate +
//         "','end':'" +
//         lastDate +
//         "'}",
//       {
//         headers: {
//           authorization: "Basic YWRtaW46cHJ0bnlubW4=",
//         },
//       }
//     );
//     io.sockets.emit("activities-afk-app", resp.data);
//     // console.log(resp.data);
//   } catch (err) {
//     // Handle Error Here
//     console.error(err);
//   }
// };

// const topPerformer = async () => {
//   try {
//     const resp = await axios.get(
//       "http://34.93.191.136:8080/users/_aggrs/topPerformer?avars={'start':'" +
//         startDate +
//         "','end':'" +
//         lastDate +
//         "'}",
//       {
//         headers: {
//           authorization: "Basic YWRtaW46cHJ0bnlubW4=",
//         },
//       }
//     );
//     io.sockets.emit("top-perform-app", resp.data);

//     // console.log(resp.data);
//   } catch (err) {
//     // Handle Error Here
//     console.error(err);
//   }
// };
