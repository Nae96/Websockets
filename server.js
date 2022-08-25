
const express = require('express');
const app = express();
const { engine } = require('express-handlebars');


const Contenedor = require("./Contenedor");
	const contenedor = new Contenedor("productos.json");

// const { createServer } = require('http');
const PORT = 8080;
const httpServer =require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {origin: '*',},
});

app.use(express.json());
app.use(express.static(__dirname+ "/public"));
app.use(express.urlencoded({extended:true}));
app.use('/public', express.static(__dirname + '/public'));

app.set('view engine', 'hbs');
app.set('views', './views');
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
  })
);

let productsHC = [
  { id: 1, title: 'Apple', price: 101, thumbnail: 'http://localhost:8080/public/Apple.jpg' },
  { id: 2, title: 'Lenovo', price: 102, thumbnail: 'http://localhost:8080/public/lenovo.jpg' },
  { id: 3, title: 'Hp', price: 103, thumbnail: 'http://localhost:8080/public/hp.jpg' },
];

let chat =[
  { 
    email: "admin@admin.com",
    message: "welcome",
    date: new Date().toLocaleDateString()
  }
]



app.get('/', (req, res) => {
  //sirve productslist.hbs en index.hbs (index.hbs es la plantilla por defecto donde arranca todo)
  res.render('productslist', { root: __dirname + '/public' });
});

// donde dice public va productos.json

io.on('connection', (socket)=>{
  console.log("New connection");
  io.sockets.emit('products', productsHC);
  io.sockets.emit('chat', chat);
  
  socket.on('newMessage', (msg)=>{
    chat.push(msg);
    io.sockets.emit('chat', chat);
   });

  socket.on('addProduct', (data)=>{
    productsHC.push(data);
    io.sockets.emit('products', productsHC);
   });

  
});
// Donde dice productsHC va contenedor

httpServer.listen(PORT, () =>{
  console.log(`Servidor iniciado escuchando por el puerto`);
});

  

// const server = app.listen(PORT, () =>
//   console.log(
//     `Servidor iniciado escuchando por el puerto ${server.address().port}`
//   )
// );

