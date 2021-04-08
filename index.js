var express = require('express');
var bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

let rawdata = fs.readFileSync(path.resolve(__dirname, 'mini_apps.json'));
let student = JSON.parse(rawdata);
// define our app using express
var app = express();

// this will help us to read POST data.
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

var port = 8080;

// instance of express Router
var router = express.Router();

router.get('/miniapps/0/version/1/preview/manifest', function (req, res) {
    res.send(['a', 'b', 'c']);
});


router.get('/miniapps/preview', function (req, res) {
    if (req.query.miniAppId) {
        return res.json(student);
    }
    res.json(student);

});



//


// router.get('/miniapps', function (req, res) {
//     res.json({ message: 'hooray! welcome to our api!' });
// });


router.get('/test', function (req, res) {
    res.json({ message: 'Testing!' });
});

app.use('/host/qwqwqw', router);

// this is default in case of unmatched routes
app.use(function (req, res) {
    // Invalid request
    console.dir(req.url)
    console.dir(req.body)
    // res.send("invalid path")
    res.send(['a', 'b', 'c']);
});

// state the server
app.listen(port);

console.log('Server listening on port ' + port);