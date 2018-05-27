var express = require('express')
var app = express()
var http = require('http').Server(app)
var path = require('path')
app.use(express.static(path.join(__dirname, 'dist')))
var port = process.env.PORT || 3000
http.listen(port, function () {
  console.log('listening on *:', port)
})
