const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const app = express();

let host = '';

if(!process.env.PORT) {
  host = 'http://localhost:8000/'
}
else {
  host = 'https://upload-file-server.herokuapp.com/upload/'
}

app.use(cors());

app.use(express.static('./upload'));

app.use(fileUpload());

app.post('/upload', function (req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  const sampleFile = req.files.sampleFile;
  const fileName = sampleFile.name;

  const dir = './upload/'

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  sampleFile.mv(dir + fileName, function (err) {
    if (err)
      return res.status(500).send(err);

    res.json({ file: host + fileName });
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
      uploadedFilePath.push(host + file);
    })
    res.json({ uploaded: uploadedFilePath });
  });

})

app.listen(process.env.PORT || 8000, function () {
  console.log('server start at port 8000!');
});
