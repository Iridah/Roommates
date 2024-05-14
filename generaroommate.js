const fetch = require('node-fetch');

module.exports = async () => {
  // Fetch random roommate data from RandomUser API
  const response = await fetch('https://randomuser.me/api/');
  const data = await response.json();
  const { results: [newRoommateData] } = data;

  // Extract roommate information from the API response
  const { name: { title, first, last }, email, picture: { large }, id: randomId } = newRoommateData;
  const nombre = `${title} ${first} ${last}`;

  // Generate a unique ID (if needed) and combine with random ID
  const id = Math.floor(Math.random() * 1000000) + 1; // Example ID generation
  const roommateId = `${id}-${randomId}`;

  // Create a new roommate object
  const newRoommate = {
    id: roommateId,
    nombre,
    email,
    picture: large,
    debe: 0, // Initialize "debe" (amount owed) to 0
    recibe: 0, // Initialize "recibe" (amount received) to 0
  };

  return newRoommate;
};
