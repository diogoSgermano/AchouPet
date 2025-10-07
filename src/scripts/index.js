import express from "express";
import exphbs from "express-handlebars";
import mysql from "mysql2";

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "diogoGer26",
  password: "26Diogo1024.",
  database: "achoupet",
});
db.connect(function (err) {
  if (err) throw err;
  console.log("Conectado ao banco de dados MySQL!");
});

// Configuração do Handlebars
app.engine("handlebars", exphbs.engine({ defaultLayout: "index" }));
app.set("view engine", "handlebars");

app.use(express.static("src/public"));

app.get("/", function(_req, res) {
  res.render("inicio");
});

app.get("/animais", function(_req, res) {
  res.render("animais");
});

app.get("/signIn", function(_req, res) {
  // Aqui, especificamos que a view 'login' deve usar o layout 'main'
  res.render("signIn", { layout: "login" });
});

app.get("/comentarios", function(_req, res) {
  // Como não especificamos um layout, ele usará o padrão: 'nav-foot'
  res.render("comentarios");
});

app.listen(8080, () => {
  console.log("Servidor rodando em http://localhost:8080");
});
