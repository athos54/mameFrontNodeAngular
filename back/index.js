const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');
const { exec } = require('child_process');
const httpServer = require('http-server');
var path = require('path');
var opn = require('opn');

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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
    var pathHttpServer = path.resolve(__dirname, 'node_modules', 'http-server', 'bin', 'http-server');
    var pathFront = path.resolve(__dirname, '../front/dist/front');

    var command = pathHttpServer + ' --port=8080 ' + pathFront;

    exec(command, (err, stdout, stderr) => {
        if (err) {
            // node couldn't execute the command
            console.log('error lauchning http-server', stderr);
            return;
        }


    });

    setTimeout(() => {
        // var command = 'google-chrome --kiosk http://localhost:8080'; //fullScreen
        var command = 'google-chrome http://localhost:8080'; //normal

        exec(command, (err, stdout, stderr) => {
            if (err) {
                // node couldn't execute the command
                console.log('error lauchning chrome', stderr);
                return;
            }


        });
    }, 500);


    // opn('http://localhost:8080', {});
});