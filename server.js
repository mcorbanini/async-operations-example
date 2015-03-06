"use strict";

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

var router = express.Router();

function online(res) {
  res.status(200).json({status: 'online'});
}
function offline(res) {
  res.status(200).json({status: 'offline'});
}
function none(res) { }

var states = [online, offline, none];

router.get('/server', function (req, res, next) {
  var index = Math.floor(Math.random()*3);
  states[index](res);
})

app.use(router);

module.exports = app;
