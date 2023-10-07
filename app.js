const express = require("express");
const app = new express();
const httpserver = require("http").Server(app);
const cluster = require("cluster");
const numofcpu = require("os").cpus().length;
const userRoutes = require("./Routes/userRoutes");
const dashboardRoutes = require("./Routes/DashboardRoutes");
const helmet = require("helmet");
require("dotenv").config();
const bodyParser = require("body-parser");

//require mongodb cpnnection
require("./DB/connection");

//app settings
app.set("port", process.env.port || 5000);

//Middlewares
app.use(express.static(__dirname));
app.use("/baseapp/user", userRoutes);
app.use("/baseapp/dashboard", dashboardRoutes);
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.isdevelopment === "development") {
  httpserver.listen(app.get("port"), () => {
    console.log(
      `server listening at port ${app.get("port")} with process id` +
        process.pid +
        "in development mode",
    );
  });
} else {
  if (cluster.isPrimary) {
    for (let i = 0; i < numofcpu; i++) {
      cluster.fork();
    }
  } else {
    httpserver.listen(app.get("port"), () => {
      console.log(
        `server listening at port ${app.get("port")} with process id` +
          process.pid,
      );
    });
  }
}
