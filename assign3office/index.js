var express=require('express')
var mysql= require('mysql')
var bodyParser=require('body-parser')
var path = require('path');
var app= express()
app.use(bodyParser.urlencoded(({extended : false})))
app.use(bodyParser.json())
app.set('views', path.join(__dirname, 'view'));
app.set('view engine','ejs');
RoutesUsers=require('./routes/users.js')
RoutesStudents=require('./routes/students.js')

app.use('/',RoutesUsers)
app.use('/student/dsfsd/',RoutesStudents)
app.listen(8001)