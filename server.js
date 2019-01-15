var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var didJWT = require('did-jwt')

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.get('/validateJWT', function (req, res) {
    if ('jwt' in req.body && 'did' in req.body) {
        didJWT.verifyJWT(req.body.jwt, {
            audience: req.body.did,
            auth: true
        }).then((response) => {
            if (req.body.did == response.signer.owner) {
                res.json({
                    status: "SUCCESS",
                    response: response
                })
            } else {
                res.json({
                    status:"ERROR",
                    response:"Valid JWT but issuer DID does not match"
                })
            }
        }).catch((error) => {
            res.json({
                status: "ERROR",
                response: error.toString()
            })
        });

    } else
        res.json({
            status: "ERROR",
            response: "Incorrect request body! Must be formatted as {jwt:'',did:''}"
        })
});


app.use('/', router);
app.listen(port);
console.log('Magic happens on port ' + port);