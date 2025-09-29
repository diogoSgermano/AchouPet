import express from "express";
import exphbs from "express-handlebars";

const app = express();

// Configuração do Handlebars
app.engine("handlebars", exphbs.engine({defaultLayout: "index"}));
app.set("view engine", "handlebars");

app.use(express.static("src/public"));

app.get("/", function(_req, res) {
  res.render("inicio");
});


app.get("/animais", function(_req, res) {
  res.render("animais");
});

app.get("/login", function(_req, res) {
  // Aqui, especificamos que a view 'login' deve usar o layout 'main'
  res.render("login", { layout: "login" });
});

app.get("/comentarios", function(_req, res) {
  // Como não especificamos um layout, ele usará o padrão: 'nav-foot'
  res.render("comentarios");
});

app.listen(8080, () => {
  console.log("Servidor rodando em http://localhost:8080");
});
