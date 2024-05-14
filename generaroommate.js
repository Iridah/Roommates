const fetch = require('node-fetch');
const cors = require('cors');


module.exports = async () => {
  // Obtiene un roommate al azar desde RandomUser API
  const response = await fetch('https://randomuser.me/api/');
  const data = await response.json();
  const { results: [newRoommateData] } = data;

  // De la respuesta de la API, extrae la info del roommate
  const { name: { title, first, last }, email, picture: { large }, id: randomId } = newRoommateData;
  const nombre = `${title} ${first} ${last}`;

  // Genera una ID unica (de ser necesario) y lo combina con random ID
  const id = Math.floor(Math.random() * 1000000) + 1; // Generador de ID al azar
  const roommateId = `${id}-${randomId}`;

  // Convierte los datos del roommate en un objeto
  const newRoommate = {
    id: roommateId,
    nombre,
    email,
    picture: large,
    debe: 0, // Cuenta contable "debe" en 0
    recibe: 0, // Cuenta contable "recibe" en 0
  };

  return newRoommate;
};
