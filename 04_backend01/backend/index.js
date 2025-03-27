const express = require('express')
const app = express();
const port = 3000

app.use(express.json());

let id_auto=4;
let usuarios = [
    {id:1,nombre:"Carlos Mosquera", edad: 23, programa:"Sistemas"},
    {id:2,nombre:"Ana Quiroga", edad: 34, programa:"Idiomas"},
    {id:3,nombre:"Luis Vasquez", edad: 18, programa:"Sistemas"}
]

const getUsers = (req, res) => {
    res.json(usuarios);
};

const getUsersById = (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = usuarios.filter( (u)=>{ return u.id === id } )
    res.json(usuario)
}

const postUsers  = (req, res) => {
    const {nombre, edad, programa} = req.body;
    const user = {id: id_auto++, nombre, edad, programa};
    usuarios.push(user);
    res.json(user)
}

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const {nombre, edad, programa} = req.body;
    const user = {id, nombre, edad, programa};
    usuarios = usuarios.map( u => u.id === id ? user : u );
    return res.json(user)
}

const deleteUser = (req,res) => {
    const id = parseInt(req.params.id);
    const index = usuarios.findIndex( u => u.id === id )
    if (index<0) {
        return res.status(404).json({"mensaje":"Elemento no encontrado"});
    }
    usuarios.splice(index,1);
    return res.sendStatus(204);
}

app.get('/users', getUsers);
app.get('/users/:id', getUsersById);
app.post('/users', postUsers)
app.put('/users/:id', updateUser)
app.delete('/users/:id', deleteUser)

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`)
  })
