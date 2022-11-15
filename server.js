const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

//Initialize express app and define PORT
const app = express();
const PORT = 3001;

//Setting up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Create route for the API
//Get notes references the notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html')));
//Retrieves notes already saved
app.get('/api/notes', (req, res) => {
    let data = fs.readFileSync('./db/db.json');
    let database = JSON.parse(data);
    res.send(database.notes)
});

//Create route to save new notes
app.post('/api/notes', (req, res) => {
    // Storing the JSON format data in myObject
    let data = fs.readFileSync('./db/db.json');
    let database = JSON.parse(data);

    // Defining new data to be added
    let newData = req.body;
    //Need to install npm install uuid in order to use the function to generate ids for new notes 
    newData.id = uuidv4();

    // Adding the new data to our object
    database.notes.push(newData);

    // Writing to our JSON file
    let noteContent = JSON.stringify(database);
    fs.writeFile('./db/db.json', noteContent, (err) => {
        // Error checking
        if (err) throw err;
        console.log("New data added");
    });
    res.status(200).send('')
})

//Create route to delete notes
app.delete(`/api/notes/:id`, (req, res) => {
    let data = fs.readFileSync('./db/db.json');
    let database = JSON.parse(data);

    // Iterating through every note and if it matches the id, then it will be deleted
    for (let i = 0; i < database.notes.length; i++) {
        if (database.notes[i].id === req.params.id) {
            database.notes.splice(i, 1);
            //After deleting the first item, we no longer need to keep looping 
            break;
        }
    }
    let noteContent = JSON.stringify(database);
    fs.writeFile('./db/db.json', noteContent, (err) => {
        // Error checking
        if (err) throw err;
        console.log("New data added");
    });
    res.status(200).send('')
});
//Starts server 
app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);