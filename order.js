const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.json());

const Validator = require('fastest-validator');

const {transaksi} = require('./models');

const v = new Validator();

const orders = [];

router.post('/orders', async (req, res) => {
const schema = {
  username:'string|min: 1',
  jenis_sampah: 'string|min: 1',
  berat_sampah: 'number|positive',
  lokasi_pengepul: 'string|min: 1',
  lokasi_user: 'string|min: 1',
  catatan: 'string|optional'
}

// Validate the request body
const validate = v.validate (req.body, schema);

if (validate.length){
  return res.status(400)
  .json(validate);
}

const { username, jenis_sampah, berat_sampah, lokasi_pengepul, lokasi_user, catatan } = req.body;

// Calculate reward points and hargaPerKg
let points;
let hargaPerKg;

switch (jenis_sampah) {
  case 'Minyak jelantah':
    points = 10;
    hargaPerKg = 9500;
    break;
  case 'Kaleng':
    points = 5;
    hargaPerKg = 13000;
    break;
  case 'Paper':
    points = 2;
    hargaPerKg = 5000;
    break;
  case 'Organik':
    points = 3;
    hargaPerKg = 3000;
    break;
  default:
    points = 0;
    hargaPerKg = 0;
    break;
}

try {
  const buatorder = await transaksi.create({
    username,
    jenis_sampah,
    hargaPerKg,
    berat_sampah,
    points,
    lokasi_pengepul,
    lokasi_user,
    catatan
  });

  orderArray.push(buatorder);
  res.status(201).json(buatorder);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
}

});
//Start server
module.exports = router;