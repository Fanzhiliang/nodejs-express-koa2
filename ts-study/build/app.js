"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var config_1 = require("./config");
var utils_1 = require("./utils");
var app = express_1.default();
app.get('/test', function (req, res) {
    res.send(utils_1.parseTime(new Date()) + '当前环境：' + process.env.NODE_ENV);
});
app.listen(config_1.PORT, function () {
    console.log("Server running at http://" + config_1.HOST + ":" + config_1.PORT + "/");
});
