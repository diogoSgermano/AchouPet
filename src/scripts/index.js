const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");

const app = express();

// Configuração do Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// Caminho correto para a pasta views
app.set("views", path.join(__dirname, "../../views"));

// Rota
app.get("/", (req, res) => {
  res.render("home", { nome: "Letícia" });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
