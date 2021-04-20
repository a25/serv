var express = require('express');
var bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const route = require('./paytm')
const cors = require('cors');

/**
 *  mini_apps.josn will have your mini apps array structure as
 *  per required by Rakutentech mini app sdk
 * */

const rawdata = fs.readFileSync(path.resolve(__dirname, 'mini_apps.json'));
const miniappList = JSON.parse(rawdata);
const rawBookingitems = fs.readFileSync(path.join(__dirname, "django", "bookingItems.json"))
const bookingitemsList = JSON.parse(rawBookingitems);
const rawMicroApps = fs.readFileSync(path.join(__dirname, "django", "microapps.json"))
const microAppsList = JSON.parse(rawMicroApps);
const rawTransactionitems = fs.readFileSync(path.join(__dirname, "django", "transactions.json"))
const transactionList = JSON.parse(rawTransactionitems);

// define our app using express
var app = express();
app.use(cors());
app.options('*', cors());
// app.use(express.static("F:/rakuntentec/js-miniapp-master-1/js-miniapp-master/js-miniapp-sample/build"));
// this will help us to read POST data.
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

var port = 8080;

// instance of express Router
var router = express.Router();
const metadataResponse = {
    "bundleManifest": {
        "reqPermissions": [
            {
                "name": "rakuten.miniapp.user.USER_NAME",
                "reason": "Describe your reason here (optional)."
            },
            {
                "name": "rakuten.miniapp.user.PROFILE_PHOTO",
                "reason": "Describe your reason here (optional)."
            }
        ],
        "optPermissions": [
            {
                "name": "rakuten.miniapp.user.CONTACT_LIST",
                "reason": "Describe your reason here (optional)."
            },
            {
                "name": "rakuten.miniapp.device.LOCATION",
                "reason": "Describe your reason here (optional)."
            },
            {
                "name": "rakuten.miniapp.user.ACCESS_TOKEN",
                "reason": "Describe your reason here (optional)."
            }
        ],

        "accessTokenPermissions": [
            {
                "audience": "rae",
                "scopes": ["idinfo_read_openid", "memberinfo_read_point"]
            },
            {
                "audience": "api-c",
                "scopes": ["your_service_scope_here"]
            }
        ],
        "customMetaData": {
            "provider": "Rakuten Group Inc",
            "description": "This is a sample mini app.",
            "description_ja": "これはサンプルのミニアプリです。",
            "fileSizeInMb": "2.3",
            "termsAndConditions": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "termsAndConditions_ja": "傍ワキヌケ春開意ヒ知他モ治要ロヨ夕局ミヘヨ見甲コウカ則整つ転写テヱヒメ型景企ツヲ育審ラ合天オネモ付31侍勃卑厩67退こルべ限門ミロウキ属39性サ員振損次克即かな。誕もすりい浪院築ぞ佐後ぴ作想フ査自ねじもク最同ずにぜ実面軽欧ばず目43弾提ス選協す稿社スソ飾狙そが都帳懸町ど。",
            "privacyPolicyLink": "https://www.example.com"
        }
    }
}
// /host/random/miniapp/0/version/random/preview/metadata
//metadata
router.get('/host/random/miniapp/0/version/1/preview/metadata', function (req, res) {
    console.dir("success " + req.url)
    res.json(metadataResponse);
});


// use manifest array to pass miniapps
router.get('/host/random/miniapp/0/version/1/preview/manifest', function (req, res) {
    console.dir("success " + req.url)
    res.json({
        "manifest": ["https://d0dc65ccd51b.ngrok.io"]
    });
})

router.get('/', function (req, res) {
    console.dir("success site zip " + req.url)
    const path = "F:/React-Shopping-Cart-master/1/React-Shopping-Cart-master/Shopping-Cart/build/js-miniapp-sample.zip"
    res.download(path)
});

router.get('/host/random/miniapps/preview', function (req, res) {
    console.dir("success url " + req.url)
    if (req.query.miniAppId) {
        return res.json(miniappList);
    }
    res.json(miniappList)

});

router.get('/host/random/miniapps', function (req, res) {
    console.dir("success url " + req.url)
    if (req.query.miniAppId) {
        return res.json(miniappList);
    }
    res.json(miniappList);

});

// below is endpoint for returning response for second and third fragment
router.get('/microapps', (_, res) => {
    res.json(microAppsList)
})

router.get('/microapps/:id', (req, res) => {
    res.send(microAppsList[req.params.id])
})

router.get('/transactions', (_, res) => {
    res.json(transactionList)
})

router.get('/transactions/:id', (req, res) => {
    res.send(transactionList[req.params.id])
})


router.get('/bookingitems', (_, res) => {
    res.json(bookingitemsList)
})

router.get('/bookingitems/:id', (req, res) => {
    res.send(bookingitemsList[req.params.id])
})
/////////////////////

app.use('/', router);
app.use('/paytm', route)

// this is default in case of unmatched routes
app.use(function (req, res) {
    // Invalid request
    console.dir("invaid url " + req.url)
    console.dir(req.body)
    // res.send("invalid path")
    res.send("invalid url");
});

// state the server
app.listen(port);

console.log('Server listening on port ' + port);


// {
//     "microapps": "http://127.0.0.1:7000/microapps/",
//     "transactions": "http://127.0.0.1:7000/transactions/",
//     "bookingitems": "http://127.0.0.1:7000/bookingitems/"
// }

