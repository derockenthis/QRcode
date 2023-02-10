const express = require("express");
const fileUpload = require('express-fileupload');
const serverless = require('serverless-http');
const fetch = require('node-fetch');

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const {uploadFile,deleteFile,getFileStream,getKey} = require('../s3');

// const cors = require("cors")

const app = express();

const cors = require("cors")
app.use(cors())


// app.use(cors())

const router = express.Router();

app.engine('ejs', require('ejs').__express);
app.set("view engine", "ejs");

app.use(express.static("public"));

app.use('/.netlify/functions/index',router)
//router and app are used interchangably
router.get('/', (req, res) => {
    // res.render('home',{"key":"none"})
    res.json({
        "hey":"turnup"
    })
 });

router.get('/:userkey', (req, res) => {
    req.params; 
    let data = req.params;
    console.log(data.userkey)
    res.render('home',{"key":data.userkey})
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
app.post('/upload/:userkey', upload.single("image"),async(req, res) => {
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
 //start server
// app.listen(3000, () => {
//     console.log("Expresss server running...")
//     } )
module.exports.handler = serverless(app);