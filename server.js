var express = require('express'),
  app = express(),
  cors = require('cors'),
  bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**********
 * ROUTES *
 **********/

app.post('/api/calculate', function create(req, res) {
  const param = req.body.argument;

  const argArr = param.split(',');

  let sum = 0;
  let deviation = 0;

  for (let i in argArr) {
    sum += parseFloat(argArr[i]);
  }

  let mean = sum / argArr.length;

  for (let j = 0; j < argArr.length; j++) {
    v1 = Math.pow(parseFloat(argArr[j]) - mean, 2);

    deviation += v1;
  }

  let average = sum / argArr.length;

  res.send({ sum, average, deviation });
});

/**********
 * SERVER *
 **********/

// listen on port 3001
app.listen(3001, function () {
  console.log('Server running on http://localhost:3001');
});
