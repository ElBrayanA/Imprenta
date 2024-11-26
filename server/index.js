const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'project2',
});

app.use(cors())
app.use(bodyParser.json())
app.use(express.json());



app.listen(4000, ()=>{
    console.log('Servidor 4000 listo')
});


//LLAMAR A LOS SERVICIOS DISPONIBLES
app.get('/servicios', (req, res) => {
    db.query('SELECT * FROM services', (err, results) => {
      if (err) return res.status(500).send(err);
      res.send(results);
    });
});

//Llamar a las ventas
app.get('/ventas', (req, res) => {
    db.query('SELECT * FROM ventas', (err, results) => {
      if (err) return res.status(500).send(err);
      res.send(results);
    });
});

//Llamar usuarios
app.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios WHERE id=5', (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

//AGREGAR USUARIOS
app.post('/register', (req, res) => {
  const { Nombre, Apellido,Email, Pass, Role } = req.body;

  // Verificar que el email y la contraseña estén presentes
  if ( !Nombre || !Apellido || !Email || !Pass) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  // Encriptar la contraseña antes de guardarla
  bcrypt.hash(Pass, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error al encriptar la contraseña:', err);
      return res.status(500).json({ message: 'Error al encriptar la contraseña' });
    }
    
    console.log('Contraseña encriptada:', hashedPassword);  // Log de depuración

    // Guardar el usuario con la contraseña encriptada en la base de datos
    db.query('INSERT INTO users (UsrName,UsrLastName,email, password, UsrRol) VALUES (?, ?, ?, ?, ?)', [Nombre,Apellido,Email, hashedPassword, Role], (err, result) => {
      if (err) {
        console.error('Error al insertar el usuario:', err);
        return res.status(500).json({ message: 'Error al registrar el usuario' });
      }

      res.status(201).json({ message: 'Usuario registrado exitosamente' });
    });
  });
});


//EDITAR UN SERVICIO
app.put('/editar/:id', (req, res) => {
  const { id } = req.params;
  const { SrvName, Price, fecha, ClientName, PhoneNumber, Status } = req.body;

  const sqlPut = "UPDATE ventas SET SrvName = ?, Price = ?, fecha = ?, ClientName = ?, PhoneNumber = ?, Status = ? WHERE id = ?";
  db.query(sqlPut, [SrvName, Price, fecha, ClientName, PhoneNumber, Status, id], (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ mensaje: 'Servicio actualizado' });
  });
});

// Eliminar
app.delete('/ventas/:id', (req, res) => {
    const { id } = req.params;

    const sqlDelete = 'DELETE FROM ventas WHERE id = ?'

    db.query(sqlDelete, id, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  });

  app.post('/ventas', (req, res) => {
    console.log('Datos recibidos:', req.body); // Log para verificar datos recibidos
    const detalles = req.body.detalles;

    const promises = detalles.map(({ SrvName, Price, cantidad, fecha, ClientName, PhoneNumber, Status }) => {
        return new Promise((resolve, reject) => {
            const sqlInsert = "INSERT INTO ventas (SrvName, Price, fecha, ClientName, PhoneNumber, Status) VALUES (?, ?, ?, ?, ?, ?)";
            db.query(sqlInsert, [SrvName, Price, fecha, ClientName, PhoneNumber, Status], (err, result) => {
                if (err) {
                    console.error('Error en la consulta SQL:', err); // Log del error SQL
                    return reject(err);
                }
                resolve(result);
            });
        });
    });

    Promise.all(promises)
        .then(() => {
            res.status(200).json({ mensaje: 'Pedido recibido' });
        })
        .catch(err => {
            console.error('Error en la promesa:', err); // Log de errores en las promesas
            res.status(500).json({ error: err.message });
        });
});


const agregarDetalle = () => {
  const fechaActual = new Date().toISOString().split('T')[0];

  if (srvName && price && cantidad && clientName && phoneNumber) {
      setDetalles([...detalles, {
          SrvName: srvName,
          Price: parseFloat(price),
          cantidad: parseInt(cantidad),
          fecha: fechaActual,
          ClientName: clientName,
          PhoneNumber: phoneNumber,
          Status: true, // Establecer status como true
      }]);
      setSrvName('');
      setPrice('');
      setCantidad('');
      setClientName('');
      setPhoneNumber('');
  } else {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
  }
};


app.post('/lonas',(req, res) =>{
  const Anchura = req.body.Anchura
  const Altura = req.body.Altura
  const Fecha = req.body.Fecha
  const Estado = req.body.Estado
  const Nombre = req.body.Nombre
  const Numero = req.body.Numero

  const sqlInsert = "INSERT INTO VentaLonas (sizeX,sizeY,fecha,estado,ClientName,PhoneNumber) VALUES (?,?,?,?,?,?);"

  db.query(sqlInsert, [Anchura,Altura,Fecha,Estado,Nombre,Numero], (err, result)=>{
  console.log(err)
  })
});
  

app.get('/ventalonas', (req, res) => {
    db.query('SELECT * FROM VentaLonas Where fecha = CURRENT_DATE', (err, results) => {
      if (err) return res.status(500).send(err);
      res.send(results);
    });
});

app.put('/putlonas', (req, res) => {
  const { id, sizeX, sizeY, ClientName, PhoneNumber, estado } = req.body;
  const sqlPut = `UPDATE VentaLonas SET sizeX = ?, sizeY = ?, ClientName = ?, PhoneNumber = ?, estado = ? WHERE Id = ?;`;
  db.query(sqlPut, [sizeX, sizeY, ClientName, PhoneNumber, estado, id], (err, result) => {
      res.send({ message: 'Lona actualizada', affectedRows: result.affectedRows });
  });
});


app.get('/ventas', (req, res) => {
    db.query('SELECT * FROM ventas Where fecha = CURRENT_DATE', (err, results) => {
      if (err) return res.status(500).send(err);
      res.send(results);
    });
});


//LOGIN
app.post('/Inicio_Sesion', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ message: 'Error en el servidor al consultar la base de datos' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = results[0];

    bcrypt.compare( password,user.password, (err, isMatch) => {
      if (err) {
        console.error('Error al comparar las contraseñas:', err);        
        return res.status(500).json({ message: 'Error en el servidor al comparar las contraseñas' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      // Generar token JWT
      const token = jwt.sign(
        { id: user.Id, role: user.UsrRol },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' },
      );

      return res.json({ 
      token:token,
      Name:user.UsrName,
    });
    });
  });
});

// Middleware para verificar el JWT y autorización de roles
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Acceso denegado' });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token no válido' });
    req.user = decoded; // Guardar los datos del usuario decodificados
    next();
  });
};

// Ruta protegida solo para usuarios
app.get('/user', verifyToken, (req, res) => {
  if (req.user.role !== 'User') return res.status(403).json({ message: 'Acceso denegado' });
  res.json({ message: 'Bienvenido al perfil de usuario' });
});

// Ruta protegida solo para admin
app.get('/admin', verifyToken, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Acceso denegado' });
  res.json({ message: 'Bienvenido al panel de administrador' });
});

app.get('/Tecnico', verifyToken, (req, res) => {
  if (req.user.role !== 'Tecnico') return res.status(403).json({ message: 'Acceso denegado' });
  res.json({ message: 'Bienvenido al panel de Tecnico' });
});


app.post('/ventasp',(req, res) =>{
  const SrvName = req.body.SrvName
  const Price = req.body.Price 
  const Cantidad = req.body.Cantidad  
  const Fecha = req.body.Fecha   
  const ClientName = req.body.ClientName
  const PhoneNumber = req.body.PhoneNumber
  const Status = req.body.Status  
  const DataColor = req.body.DataColor 
  const DataTalla = req.body.DataTalla 
  const Ancho = req.body.Ancho
  const Alto = req.body.Alto 

  const sqlInsert = "INSERT INTO ventasp (srv_name,price,cantidad, fecha, client_name, phone_number, status, color, talla, ancho, alto) VALUES (?,?,?,?,?,?,?,?,?,?,?);"

  db.query(sqlInsert, [SrvName, Price, Cantidad, Fecha, ClientName, PhoneNumber,Status, DataColor, DataTalla,Ancho, Alto], (err, result)=>{
  console.log(result)
  })
}); 

