const express = require('express');
const fs = require('fs');
const chalk = require('chalk');
const nodemailer = require('nodemailer');
const generateRoommate = require('./generaroommate.js');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Datos de Roommates y Gastos (parte vacio)
let roommates = [];
let gastos = [];

// Prueba de carga CORS
app.use(cors());

// Carga de datos inicial desde el JSON (si existe)
try {
  const roommatesData = fs.readFileSync('roommates.json', 'utf-8');
  roommates = JSON.parse(roommatesData);
} catch (err) {
  console.error(chalk.red('Error leyendo archivo roommates.json:', err));
}

try {
  const gastosData = fs.readFileSync('gastos.json', 'utf-8');
  gastos = JSON.parse(gastosData);
} catch (err) {
  console.error(chalk.red('Error leyendo archivo gastos.json:', err));
}

// Funcion para escribir datos al JSON
const saveData = (data, filename) => {
  try {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(chalk.red('Error al guardar los datos en ', filename, err));
  }
};

// Error de middleware
app.use((err, req, res, next) => {
  console.error(chalk.red('Error:', err.message));
  res.status(500).send({ message: 'Error interno del servidor' });
});

// API routes

// GET /gastos: Mostrar todos los gastos
app.get('/gastos', (req, res) => {
  res.json({ gastos });
});

// POST /gasto: agrega un nuevo gasto
app.post('/gasto', (req, res) => {
    try {
        const newGasto = req.body;
        gastos.push(newGasto);
        saveData(gastos, 'gastos.json');
        res.json({ message: 'Gasto agregado exitosamente' });
      } catch (err) {
        console.error(chalk.red('Error al agregar gasto:', err));
        res.status(500).json({ message: 'Error al agregar gasto' });
      }
});

// PUT /gasto: Actualizando un gasto existente
app.put('/gasto', (req, res) => {
    try {
      const id = req.query.id;
      const updatedGasto = req.body;
  
      const gastoIndex = gastos.findIndex((gasto) => gasto.id === id);
      if (gastoIndex !== -1) {
        gastos[gastoIndex] = updatedGasto;
        saveData(gastos, 'gastos.json');
        res.json({ message: 'Gasto actualizado exitosamente' });
      } else {
        res.status(404).json({ message: 'Gasto no encontrado' });
      }
    } catch (err) {
      console.error(chalk.red('Error al actualizar gasto:', err));
      res.status(500).json({ message: 'Error al actualizar gasto' });
    }
  });

// DELETE /gasto: Borra un gasto existente
app.delete('/gasto', (req, res) => {
    try {
      const id = req.query.id;
  
      const newGastos = gastos.filter((gasto) => gasto.id !== id);
      if (newGastos.length !== gastos.length) {
        gastos = newGastos;
        saveData(gastos, 'gastos.json');
        res.json({ message: 'Gasto eliminado exitosamente' });
      } else {
        res.status(404).json({ message: 'Gasto no encontrado' });
      }
    } catch (err) {
      console.error(chalk.red('Error al eliminar gasto:', err));
      res.status(500).json({ message: 'Error al eliminar gasto' });
    }
  });

// GET /roommates: Devuelve la lista de todos los roommates
app.get('/roommates', (req, res) => {
  res.json({ roommates });
});

// POST /roommate: Creates a new roommate
app.post('/roommate', async (req, res) => {
    try {
      // Generate a new roommate using the imported function
      const newRoommate = await generateRoommate();
  
      // Add the new roommate to the `roommates` array
      roommates.push(newRoommate);
  
      // Save the updated roommates data to the JSON file
      saveData(roommates, 'roommates.json');
  
      // Send a notification email (optional)
      // ```javascript
      // const transporter = nodemailer.createTransport({
      //   host: '[se quitó una URL no válida]',
      //   port: 587,
      //   auth: {
      //     user: '[dirección de correo electrónico eliminada]',
      //     pass: 'your-password'
      //   }
      // });
  
      // const mailOptions = {
      //   from: '[dirección de correo electrónico eliminada]',
      //   to: '[dirección de correo electrónico eliminada]',
      //   subject: 'Nuevo Roommate Agregado',
      //   text: `Se ha agregado un nuevo roommate: ${newRoommate.nombre}`
      // };
  
      // await transporter.sendMail(mailOptions);
      // ```
  
      res.json({ message: 'Roommate agregado exitosamente' });
    } catch (err) {
      console.error(chalk.red('Error creating roommate:', err));
      res.status(500).json({ message: 'Error al agregar roommate' });
    }
  });

// Iniciar el server
app.listen(port, () => {
  console.log(chalk.green(`Server activo en puerto ${port}`));
});
