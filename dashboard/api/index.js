var express = require('express');
var mysql = require("mysql");

var app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.json());

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'mapas'
});

connection.connect();

app.route('/').get((req, res) => {
  connection.query('select * from marcadores', (erro, resposta) => {
    if(erro){
      res.send(erro);
    }else{
      res.send(resposta);
    }
  });
});

app.route('/adicionar').post((req, res) => {
  var urlicone = req.body.urlicone;
  var latitude = req.body.latitude;
  var longitude = req.body.longitude;

  var inserir = "insert into marcadores (urlicone, latitude, longitude) values ('"+urlicone+"', "+latitude+", "+longitude+")";

  connection.query(inserir, (erro, resposta) => {
    if(erro){
      res.send(erro);
    }else{
      res.send(resposta);
    }
  });
});

app.route('/apagar').delete((req, res) => {
  var id = req.body.id;

  var deletar = "delete from marcadores where id = "+id;

  connection.query(deletar, (erro, resposta) => {
    if(erro){
      res.send(erro);
    }else{
      res.send(resposta);
    }
  });
});;

app.listen(3000);
