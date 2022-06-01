const express = require('express');
const app = express();
const port = 3000;

// Parse JSON bodies for this app. Make sure you put
// `app.use(express.json())` **before** your route handlers!
app.use(express.json());
let databaseIndex = 3;
DATABASE = [
  {
    id: 1,
    name: 'Metal Gear',
    console: 'PS',
    year: 1990,
    multiplayer: false
  },
  {
    id: 2,
    name: 'God of War',
    console: 'PS',
    year: 1995,
    multiplayer: false
  },
  {
    id: 3,
    name: 'Fortnite',
    console: 'PC',
    year: 2015,
    multiplayer: true
  },
];


// Route Handlers
app.get('/', (request, response) => {
  response.send('Hello World!');
});

app.get('/videogames', (request, response) => {
  const filter = request.query.filter;
  if(filter) {
    const result = DATABASE.map(videogame => {
      if (typeof filter === "object") {
        return filter.map(parameter => videogame[parameter]).join(', ');
      } else {
        return videogame[filter];
      }
    });
    response.send(result);
    return;
  }
  response.send(DATABASE);
});

app.get('/videogames/:videogameId', (request, response) => {
  const videogameId = request.params.videogameId;
  const result = DATABASE.find(videogame => videogame.id == videogameId);
  if (!result) {
    response.status(404).send(`Videogame with id ${videogameId} was not found in the database.`);
    return;
  }
  response.send(result);
});

app.put('/videogames/:videogameId', (request, response) => {
  const videogameId = request.params.videogameId;
  const {name, console, year, multiplayer} = request.body;
  const result = DATABASE.find(videogame => videogame.id == videogameId);
  if (!result) {
    response.status(404).send(`Videogame with id ${videogameId} was not found in the database.`);
    return;
  }
  result.name = name;
  result.console = console;
  result.year = year;
  result.multiplayer = multiplayer;

  response.status(200).send("OK");
});

app.post('/videogames/', (request, response) => {
  const {name, console, year, multiplayer} = request.body;
  const newObject = {name, console, year, multiplayer};
  databaseIndex += 1;
  newObject.id = databaseIndex;
  DATABASE.push(newObject);
  response.status(201).send(newObject.id);
  // response.status(201).send(newObject);
});

app.delete('/videogames/:videogameId', (request, response) => {
  const videogameId = request.params.videogameId;
  const result = DATABASE.find(videogame => videogame.id == videogameId);
  if (!result) {
    response.status(404).send(`Videogame with id ${videogameId} was not found in the database.`);
    return;
  }
  const index = DATABASE.indexOf(result);
  DATABASE.splice(index, 1);
  response.status(200).send(`Videogame with id ${videogameId} has been deleted.`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
