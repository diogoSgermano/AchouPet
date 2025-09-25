import express from "express";
import exphbs from "express-handlebars";

const app = express();

// Configuração do Handlebars
app.engine("handlebars", exphbs.engine({defaultLayout: "home"}));
app.set("view engine", "handlebars");

app.use(express.static("src/public"));

app.get("/", function(_req, res) {
  res.render("inicio");
});

app.get("/animais", function(_req, res) {
  res.render("animais");
} );
app.listen(8080, () => {
  console.log("Servidor rodando em http://localhost:8080");
});

