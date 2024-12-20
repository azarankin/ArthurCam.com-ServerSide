//to delete not needed installation
const express = require("express");
const { createServer } = require("http");
const app = express();
const server = createServer(app);
const server2 = createServer(app);
module.exports = {
    express, app, server, server2
};