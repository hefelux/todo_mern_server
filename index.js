const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Creamos servidor
const app = express();

// Conectar a base de datos
connectDB();

// Habilitar Cors
app.use(cors());

// Habilitar express.json para lectura de header json
app.use(express.json({ extended: true }));

// Definimos puerto de la app
const PORT = process.env.PORT || 4000;

// Importar rutas
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));

//Definir página principal
app.get('/', (req,res) => {
    res.send('Hola Mundo');
})

app.listen(PORT, '0.0.0.0', () => {
    console.log(`EL servidor está funcionando en el puerto: ${ PORT }`);
});