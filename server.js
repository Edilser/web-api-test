const express = require('express')
const sta = require('serve-static')
const path = require('path')

const app = express();

app.use('/', sta(path.join(__dirname, '/dist')))

const port = process.env.PORT || 8080;

app.listen(port)

