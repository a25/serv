const { Router } = require('express');
const https = require('https');
const fetch = require('node-fetch');
const router = Router()
// /*
// * import checksum generation utility
// * You can get this utility from https://developer.paytm.com/docs/checksum/
// */
let PaytmChecksum = require('PaytmChecksum');
let mtoken = "<merchent-token>"
let mId = "<merchant-Id>"

var paytmParams = {};


// /*
// * Generate checksum by parameters we have in body
// * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
// */
router.get('/redirect', (req, res) => {
    console.log("redirection url", req.url, req.params, req.query)
    req.send('')
})

router.get('/', (req, res) => {
    console.log("paytm", req.params, req.query,req.query.txnAmount,req.query.orderId,req.query.custId)


    paytmParams.body = {
        "requestType": "Payment",
        "mid": mId,
        "websiteName": "WEBSTAGING",
        "orderId":  req.query.orderId,
        "callbackUrl": `https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=${req.query.orderId}`,
        "txnAmount": {
            "value":  req.query.txnAmount,
            "currency": "INR",
        },
        "userInfo": {
            "custId": req.query.custId,
        },

    };
    console.log(paytmParams.body )

    PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), mtoken).then(function (checksum) {

        paytmParams.head = {
            "signature": checksum
        };

        var post_data = JSON.stringify(paytmParams);

        fetch(`https://securegw-stage.paytm.in:443/theia/api/v1/initiateTransaction?mid=${mId}&orderId=${req.query.orderId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            },
            body: post_data
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                res.send({ "CHECKSUMHASH": json.body.txnToken })
            })

    });
})

module.exports = router

