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
  client = new kafka.KafkaClient("34.93.87.163:9092"),
  usersConsumer = new Consumer(
    client,
    [{ topic: "proton_server.proton_dev.users", partition: 0 }],
    {
      autoCommit: true,
    }
  ),
  timelineConsumer = new Consumer(
    client,
    [{ topic: "proton_server.proton_dev.aw-watcher-timeline", partition: 0 }],
    {
      autoCommit: true,
    }
  );

afkConsumer = new Consumer(
  client,
  [{ topic: "proton_server.proton_dev.aw-watcher-afk", partition: 0 }],
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

usersConsumer.on("message", function (message) {
  console.log("trigger kafka");
  if (message.value != null) {
    var data = JSON.parse(message.value);
    var record = JSON.parse(data.payload.after);
    if (record != null) {
      console.log(record);
      console.log(record.orgID);
      io.sockets.emit("overview-dashboard", record.orgID);
      io.sockets.emit("activies-app", record.orgID);
      io.sockets.emit("dashboard-afk-app", record.orgID);
    }
  }
});

afkConsumer.on("message", function (message) {
  console.log("trigger kafka");
  // io.sockets.emit("get-activitiesUserId", { value: true });
  afkApp();
  if (activiesUserId != null) {
    afkAppById();
  }
});

timelineConsumer.on("message", function (message) {
  console.log("trigger kafka");
  // io.sockets.emit("get-activitiesUserId", { value: true });
  activityApp();
  topPerformer();
  setTimeout(function () {
    mostUsedAPP();
  }, 200);
  if (activiesUserId != null) {
    activityAppByUserId();
    setTimeout(function () {
      mostUsedAPPById();
    }, 200);
  }
});

const activityApp = async () => {
  try {
    const resp = await axios.get(
      "http://34.93.191.136:8080/aw-watcher-timeline/_aggrs/activities?avars={'start':'" +
        startDate +
        "','end':'" +
        lastDate +
        "'}",
      {
        headers: {
          authorization: "Basic YWRtaW46cHJ0bnlubW4=",
        },
      }
    );
    io.sockets.emit("activies-app", resp.data);

    // console.log(resp.data);
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

const activityAppByUserId = async () => {
  try {
    const resp = await axios.get(
      "http://34.93.191.136:8080/aw-watcher-timeline/_aggrs/activities-for-activities?avars={'id':'" +
        activiesUserId +
        "','start':'" +
        startDate +
        "','end':'" +
        lastDate +
        "'}",
      {
        headers: {
          authorization: "Basic YWRtaW46cHJ0bnlubW4=",
        },
      }
    );
    io.sockets.emit("activites-active-widget", resp.data);

    // console.log(resp.data);
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

const mostUsedAPP = async () => {
  try {
    const resp = await axios.get(
      "http://34.93.191.136:8080/aw-watcher-timeline/_aggrs/most-used-apps?avars={'start':'" +
        startDate +
        "','end':'" +
        lastDate +
        "'}",
      {
        headers: {
          authorization: "Basic YWRtaW46cHJ0bnlubW4=",
        },
      }
    );
    io.sockets.emit("most-used-app", resp.data);

    // console.log(resp.data);
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

const mostUsedAPPById = async () => {
  try {
    const resp = await axios.get(
      "http://34.93.191.136:8080/aw-watcher-timeline/_aggrs/most-used-apps-activities?avars={'id':'" +
        activiesUserId +
        "','start':'" +
        startDate +
        "','end':'" +
        lastDate +
        "'}",
      {
        headers: {
          authorization: "Basic YWRtaW46cHJ0bnlubW4=",
        },
      }
    );
    io.sockets.emit("activities-most-used-app", resp.data);

    // console.log(resp.data);
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

const afkApp = async () => {
  try {
    const resp = await axios.get(
      "http://34.93.191.136:8080/aw-watcher-afk/_aggrs/afk?avars={'start':'" +
        startDate +
        "','end':'" +
        lastDate +
        "'}",
      {
        headers: {
          authorization: "Basic YWRtaW46cHJ0bnlubW4=",
        },
      }
    );
    io.sockets.emit("dashboard-afk-app", resp.data);
    // console.log(resp.data);
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

//
//
// firstTreeNode

const afkAppById = async () => {
  try {
    const resp = await axios.get(
      "http://34.93.191.136:8080/aw-watcher-afk/_aggrs/afk-activities?avars={'id':'" +
        activiesUserId +
        "','start':'" +
        startDate +
        "','end':'" +
        lastDate +
        "'}",
      {
        headers: {
          authorization: "Basic YWRtaW46cHJ0bnlubW4=",
        },
      }
    );
    io.sockets.emit("activities-afk-app", resp.data);
    // console.log(resp.data);
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

const topPerformer = async () => {
  try {
    const resp = await axios.get(
      "http://34.93.191.136:8080/users/_aggrs/topPerformer?avars={'start':'" +
        startDate +
        "','end':'" +
        lastDate +
        "'}",
      {
        headers: {
          authorization: "Basic YWRtaW46cHJ0bnlubW4=",
        },
      }
    );
    io.sockets.emit("top-perform-app", resp.data);

    // console.log(resp.data);
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};
