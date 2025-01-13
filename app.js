const express = require('express');
const app = express();
const PORT = 3000;

//Añadimos estas 2 líneas en app.js por encima de todas las rutas para que no generen errores de lectura.
//Son Middleware para manejar JSON y datos codificados en URL

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//traemos los usuarios

let usuarios = [
    { id: 1, nombre: 'Ryu', edad: 32, lugarProcedencia: 'Japón' },
    { id: 2, nombre: 'Chun-Li', edad: 29, lugarProcedencia: 'China' },
    { id: 3, nombre: 'Guile', edad: 35, lugarProcedencia: 'Estados Unidos' },
    { id: 4, nombre: 'Dhalsim', edad: 45, lugarProcedencia: 'India' },
    { id: 5, nombre: 'Blanka', edad: 32, lugarProcedencia: 'Brasil' },
];

// RUTA PRINCIPAL

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Street Fighter API</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #333; }
                    ul { list-style-type: none; padding: 0; }
                    li { margin: 10px 0; }
                    a { text-decoration: none; color: #007BFF; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <h1>Bienvenido a la API de Street Fighter</h1>
                <p>Usa los siguientes enlaces para interactuar con la API:</p>
                <ul>
                    <li><a href="/usuarios" target="_blank">GET /usuarios</a> - Ver todos los usuarios</li>
                    <li><a href="#" onclick="alert('Usa Postman o un cliente HTTP para enviar datos'); return false;">POST /usuarios</a> - Crear un nuevo usuario</li>
                    <li><a href="#" onclick="alert('Usa Postman o un cliente HTTP para enviar datos'); return false;">PUT /usuarios/:nombre</a> - Actualizar un usuario</li>
                    <li><a href="#" onclick="alert('Usa Postman o un cliente HTTP para enviar datos'); return false;">DELETE /usuarios/:nombre</a> - Eliminar un usuario</li>
                </ul>
                <p>Para operaciones POST, PUT y DELETE, utiliza herramientas como Postman o Thunder Client.</p>
            </body>
        </html>
    `);
});

//Creamos Endpoints CRUD (Create, Read, Update, Delete)
// Se agrega esta ruta para devolver la lista completa de usuarios

app.get('/usuarios', (req, res) => {
    res.json(usuarios);
});

// POST /USUARIOS para Crear un nuevo usuario
// Esta ruta permite agregar un nuevo usuario. Usamos req.body para obtener los datos enviados
//en el cuerpo de la solicitud

app.post('/usuarios', (req, res) => {
    const {id, nombre, edad, lugarProcedencia } = req.body;
    if (!id || !nombre || !edad || !lugarProcedencia) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const nuevoUsuario = { id, nombre, edad, lugarProcedencia};
    usuarios.push(nuevoUsuario); //usamos el push para agregar el nuevo usuario
    res.status(201),json(nuevoUsuario)
});

// Luego creamos el GET/usuarios/:nombre para obtener el usuario por nombre
//con esta ruta devolvemos un usuario específico basado en el parámetro :nombre.

app.get('/usuarios/:nombre', (req, res) => {
    const { nombre } = req.params;
    const usuario = usuarios.find(user => user.nombre.toLowerCase() === nombre.toLowerCase());
    if (!usuario) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(usuario);
});

//Luego creamos el PUT /usuarios/:nombre, se usa para actualizar un usuario por nombre
//Con esta ruta actualizamos los datos de un usuario específico utilizando //!FindIndex.

app.put('/usuarios/:nombre', (req, res) => {
    const { nombre } = req.params;
    const { edad, lugarProcedencia} = req.body;
    const index = usuarios.findIndex(user.nombre.toLowerCase() === nombre.toLowerCase());

    if (index === -1) {
        return res.status(404).json({ error: 'User not found'});
    }

    if (edad) usuarios[index].edad = edad;
    if (lugarProcedencia) usuarios[index].lugarProcedencia = lugarProcedencia;

    res.json(usuarios[index]);
});

//Creamos el DELETE/usuarios/:nombre para eliminar un usuario por nombre
// con esta ruta eliminamos un usuario usando el método //!FILTER

app.delete('/usuarios/:nombre', (req, res) => {
    const { nombre } = req.params;
    const usuarioExiste = usuarios.some(user => user.nombre.toLowerCase() === nombre.toLowerCase());

    if (!usuarioExiste) {
        return res.status(404).json({ error: 'User does not exist' });
    }

    usuarios = usuarios.filter(user => user.nombre.toLowerCase() !== nombre.toLowerCase());
    res.json({ message: `User ${nombre} eliminated` })
});

//Por ultimo escuchamos y iniciamos el servidor

app.listen(PORT, () => {
    console.log(`Listening server on http://localhost:${PORT}`);
});