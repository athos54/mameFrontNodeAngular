const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');
const { exec } = require('child_process');
var cors = require('cors');
app.use(cors());

app.get('/lanzar', (req, res) => {
    var juego = req.param('juego');
    console.log(req.params)


    var command = 'mame ' + juego;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            // node couldn't execute the command
            console.log('error', stderr);
            console.log(command);


            return;
        }
        console.log('juego lanzado');


        res.json('mameCerrado');
    });
})

app.get('/getjuegos', (req, res, next) => {
    var result = [];

    fs.readdir('/home/athos/mame/roms', (err, files) => {
        files.forEach(file => {
            if (file.split('.')[1] === 'zip') {
                result.push(file);
            }
        });
        res.json(result);
    });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))