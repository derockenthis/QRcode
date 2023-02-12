const express = require("express");
const fileUpload = require('express-fileupload');
const serverless = require('serverless-http');
const fetch = require('node-fetch');

const multer  = require('multer')
//gotta use tmp folder
const upload = multer({ dest: '/tmp/' })
const {uploadFile,deleteFile,getFileStream,getKey} = require('../s3');

// const cors = require("cors")

const app = express();
const path = require('path');
const cors = require("cors")
app.use(cors())
//static

// app.use(express.static(__dirname + '/public'));

// app.use(cors())

const router = express.Router();
//router and app are used interchangably
router.get('/', (req, res) => {
    // res.json({
    //     "hey":"testing"
    // })
    console.log('Current directory: ' + process.cwd());
    res.sendFile("views/index.html",{ root: __dirname });
 });

router.get('/:userkey', (req, res) => {
    // req.params; 
    // let data = req.params;
    // console.log(data.userkey)
    res.sendFile(path.join(__dirname+'/index.html'))
});

router.post('/upload/:userkey', upload.single("image"),async(req, res) => {
    //get userkey
    req.params; 
    let data = req.params;

    // Get the file that was set to our field named "image"
    console.log(req.file);
    const file = req.file;
    const result = await uploadFile(file,data.userkey)

    // If no image submitted, exit
    // if (!image) return res.sendStatus(400);

    // Move the uploaded image to our upload folder

    //all good
    res.sendStatus(200);
});
app.get('/getImage/:userKey',async(req, res) => {
    const key = req.params.userKey
    const checkKey = await getKey(key)
    console.log(checkKey)
    if(checkKey == true){
        const readStream = getFileStream(key)
        readStream.pipe(res)
    }
    else{
        res.sendStatus(400)
    }
    console.log("THEYWANTME")
});

 //start server
// app.listen(3000, () => {
//     console.log("Expresss server running...")
//     } )
app.use('/.netlify/functions/index',router)
module.exports.handler = serverless(app);
