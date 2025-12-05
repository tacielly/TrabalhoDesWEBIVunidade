const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const app = express();

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let reservas = [];
let produtos = [];

app.get('/', (req, res) => res.render('home'));

app.get('/reservas', (req, res) => res.render('reservas/index', { reservas }));
app.get('/reservas/novo', (req, res) => res.render('reservas/novo'));
app.post('/reservas/novo', (req, res) => {
  const { nome, quarto, dias, tipo } = req.body;
  reservas.push({ id: Date.now(), nome, quarto, dias, tipo });
  res.redirect('/reservas');
});
app.get('/reservas/editar/:id', (req, res) => {
  const reserva = reservas.find(r => r.id == req.params.id);
  res.render('reservas/editar', { reserva });
});
app.post('/reservas/editar/:id', (req, res) => {
  const i = reservas.findIndex(r => r.id == req.params.id);
  reservas[i] = { ...reservas[i], ...req.body };
  res.redirect('/reservas');
});
app.post('/reservas/excluir/:id', (req, res) => {
  reservas = reservas.filter(r => r.id != req.params.id);
  res.redirect('/reservas');
});

app.get('/produtos', (req, res) => res.render('produtos/index', { produtos }));
app.get('/produtos/novo', (req, res) => res.render('produtos/novo'));
app.post('/produtos/novo', (req, res) => {
  const { nome, preco } = req.body;
  produtos.push({ id: Date.now(), nome, preco });
  res.redirect('/produtos');
});
app.get('/produtos/editar/:id', (req, res) => {
  const produto = produtos.find(p => p.id == req.params.id);
  res.render('produtos/editar', { produto });
});
app.post('/produtos/editar/:id', (req, res) => {
  const i = produtos.findIndex(p => p.id == req.params.id);
  produtos[i] = { ...produtos[i], ...req.body };
  res.redirect('/produtos');
});
app.post('/produtos/excluir/:id', (req, res) => {
  produtos = produtos.filter(p => p.id != req.params.id);
  res.redirect('/produtos');
});

app.get('/relatorios', (req, res) => {
  const totalReservas = reservas.length;
  const totalProdutos = produtos.length;
  res.render('relatorios', { totalReservas, totalProdutos });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
