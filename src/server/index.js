import express from "express";
import exphbs from "express-handlebars";
import db from "../db/database.js";
import path from "path";
import bcrypt from "bcrypt"; // Importa a biblioteca bcrypt para criptografia de senhas
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuração do Handlebars
app.set("views", path.join(__dirname, "..", "..", "views"));
app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "index",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: [
      path.join(app.get("views"), "partials"),
      path.join(app.get("views"), "login"),
    ],
  })
);
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, "..", "public")));

// Middleware para conseguir ler o corpo (body) das requisições HTTP
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function(_req, res) {
  res.render("inicio");
});

app.get("/animais", function(_req, res) {
  res.render("animais");
});

app.get("/anunciar", function(_req, res){
  res.render("anunciar");
});

app.get("/login/signIn", function(_req, res) {
  // Aqui, especificamos que a view 'login' deve usar o layout 'main'
  res.render("login/signIn", { layout: "login" });
});

app.get("/comentarios", function(_req, res) {
  // Como não especificamos um layout, ele usará o padrão: 'nav-foot'
  res.render("comentarios");
});

app.get("/visualizaranimal", function(_req, res) {
  res.render("visualizaranimal");
});

app.get("/login/redefinirsenha", function(_req, res) {
  // Aqui, especificamos que a view 'login' deve usar o layout 'main'
  res.render("login/redefinirsenha", { layout: "login" });
});

app.get("/login/novasenha", function(_req, res) {
  // Aqui, especificamos que a view 'login' deve usar o layout 'main'
  res.render("login/novasenha", { layout: "login" });
});

app.get("/login/criarconta", function(_req, res) {
  // Aqui, especificamos que a view 'login' deve usar o layout 'main'
  res.render("login/criarconta", { layout: "login" });
});

// Rota GET para a página de criar senha, agora recebendo o ID do usuário
app.get("/login/criarsenha/:userId", function(req, res) {
  // Extrai o ID do usuário dos parâmetros da rota
  const userId = req.params.userId;
  // Renderiza a página passando o userId para o formulário
  res.render("login/criarsenha", { layout: "login", userId: userId });
});

app.get("/opcoes", function(_req, res) {
  // Aqui, especificamos que a view 'login' deve usar o layout 'main'
  res.render("opcoes", { layout: "login" });
});

app.get("/login/cadastrar-animal",function(_req,res){
  res.render("login/cadastraranimal",{layout:"login"});
});

// POST
// Rota POST para receber os dados do formulário de criar conta
app.post("/login/criarconta", (req, res) => {
  // Extrai os dados do corpo da requisição
  const { nome, cpf, email, telefone } = req.body;

  const sql = "INSERT INTO usuarios (nome, cpf, email, telefone) VALUES (?, ?, ?, ?)";
  const values = [nome, cpf, email, telefone];

  // Executa a query no banco de dados
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Erro ao inserir usuário no banco de dados:", err);
      // Idealmente, você renderizaria uma página de erro aqui
      res.status(500).send("Ocorreu um erro ao criar sua conta. Tente novamente.");
      return;
    }

    console.log(`Usuário inserido com sucesso! ID: ${result.insertId}`);

    // Redireciona para a página de criação de senha, passando o ID do novo usuário na URL
    res.redirect(`/login/criarsenha/${result.insertId}`);
  });
});

// Rota POST para salvar a senha do usuário
app.post("/login/criarsenha/:userId", async (req, res) => {
  // Extrai os dados do corpo da requisição
  const { senha, senhaRepetir } = req.body;
  // Extrai o userId dos parâmetros da URL
  const { userId } = req.params;
  // 1. Validação: Verifica se as senhas são iguais
  if (senha !== senhaRepetir) {
    // A validação do frontend deve ter impedido isso.
    // Retorna um erro genérico, pois isso não deveria acontecer em um fluxo normal.
    return res.status(400).send("Ocorreu um erro de validação. Tente novamente.");
  }

  try {
    // 2. Criptografia: Gera um "sal" e cria o hash da senha
    const saltRounds = 10; // Fator de custo para a criptografia
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // 3. Persistência: Define a query SQL para INSERIR a nova senha na tabela 'senhas',
    // relacionando-a com o usuário através do 'id_usuario'.
    const sql = "INSERT INTO senhas (senha, id_usuario) VALUES (?, ?)";
    const values = [senhaHash, userId];

    // Executa a query no banco de dados
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Erro ao atualizar a senha do usuário:", err);
        return res.status(500).send("Ocorreu um erro ao salvar sua senha.");
      }

      console.log(`Senha do usuário com ID ${userId} atualizada com sucesso.`);

      // 4. Redirecionamento: Redireciona para a página de animais após o sucesso
      res.redirect("/animais");
    });
  } catch (error) {
    console.error("Erro ao criptografar a senha:", error);
    res.status(500).send("Ocorreu um erro de segurança ao processar sua senha.");
  }
});

// Rota POST para verificar se o usuário existe ao tentar fazer login
app.post("/login/verificarUsuario", (req, res) => {
  const { emailEntrar, senhaEntrar } = req.body;

  // Consulta que busca o usuário pelo email ou CPF
  const sql = `
    SELECT u.id, u.email, u.cpf, s.senha 
    FROM usuarios u 
    JOIN senhas s ON u.id = s.id_usuario 
    WHERE u.email = ? OR u.cpf = ?
  `;

  db.query(sql, [emailEntrar, emailEntrar], async (err, results) => {
    if (err) {
      console.error("Erro ao buscar usuário:", err);
      return res.status(500).json({ success: false, message: "Erro no servidor." });
    }

    if (results.length === 0) {
      // Usuário não encontrado
      return res.json({ success: false, message: "Usuário não encontrado." });
    }

    // Usuário encontrado — agora verificar a senha
    const usuario = results[0];
    const senhaCorreta = await bcrypt.compare(senhaEntrar, usuario.senha);

    if (!senhaCorreta) {
      return res.json({ success: false, message: "Senha incorreta." });
    }

    // Tudo certo
    res.json({ success: true });
  });
});



app.listen(8080, () => {
  console.log("Servidor rodando em http://localhost:8080");
  console.log("Animais: http://localhost:8080/animais")
});
