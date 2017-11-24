const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const bodyParser = require('body-parser')

const app = express();

let path = '';
const dir = './upload/'

if (!process.env.PORT) {
  path = 'http://localhost:8000/upload/'
}
else {
  path = 'https://upload-file-server.herokuapp.com/upload/'
}

app.use(cors());

app.use(bodyParser.json());

app.use(express.static(__dirname));

app.use(fileUpload());

app.post('/upload', function (req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  const sampleFile = req.files.sampleFile;
  const fileName = sampleFile.name;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  sampleFile.mv(dir + fileName, function (err) {
    if (err)
      return res.status(500).send(err);

    res.json({ file: path + fileName });
  });

});

app.get('/uploaded', function (req, res) {

  let uploadedFilePath = [];

  fs.readdir('./upload', (err, files) => {

    if (!files) {
      res.json({ uploaded: [] });
      return;
    }

    files.forEach(file => {
      uploadedFilePath.push({ url: path + file, name: file, info: fs.statSync(`${__dirname}/upload/${file}`) });
    })
    res.json({ uploaded: uploadedFilePath });
  });

});

app.delete('/delete', function (req, res) {
  const filename = req.body.filename;
  const path = `${__dirname}/upload/${filename}`;

  if (fs.existsSync(path)) {
    try {
      fs.unlinkSync(path);
    } catch (err) {
      res.status(500).json({code: 500, msg:'Can not delete this file'});
    }
    res.status(200).json({code: 200, msg: 'Delete file success!'});
  }
  else {
    res.status(400).json({code: 400, msg: 'File not exist!!'});
  }
});

app.listen(process.env.PORT || 8000, function () {
  console.log(`server start at port ${process.env.PORT | 8000}!`);
});
