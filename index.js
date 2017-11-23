const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const app = express();

app.use(cors());

app.use(express.static('.'));

app.use(fileUpload());

app.post('/upload', function (req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  const sampleFile = req.files.sampleFile;
  const fileName = sampleFile.name;

  sampleFile.mv('./upload/' + fileName, function (err) {
    if (err)
      return res.status(500).send(err);

    res.json({ file: 'http://localhost:8000/upload/' + fileName });
  });

});

app.get('/uploaded', function (req, res) {

  let uploadedFilePath = [];

  fs.readdir('./upload', (err, files) => {
    files.forEach(file => {
      uploadedFilePath.push('http://localhost:8000/upload/' + file);
    })
    res.json({ uploaded: uploadedFilePath });
  });

})

app.listen(8000, function () {
  console.log('server start at port 8000!');
});