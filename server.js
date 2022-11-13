const express = require('express');
const path = require('path');
const fs = require('fs');

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
    //Function to generate ids for notes 
    function create_UUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
    newData.id = create_UUID();

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
