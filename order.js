const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.json());

const Validator = require('fastest-validator');

const {transaksi} = require('./models');

const v = new Validator();

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

// Calculate reward points
let points;
switch (jenis_sampah) {
  case 'Minyak jelantah':
    points = 10;
    break;
  case 'Kaleng':
    points = 5;
    break;
  case 'Organik':
    points = 3;
    break;
  case 'Paper':
    points = 2;
    break;
  default:
    points = 0;
}

let hargaPerKg;
switch (jenis_sampah) {
  case 'Minyak jelantah':
    hargaPerKg = 9500;
    break;
  case 'Kaleng':
    hargaPerKg = 13000;
    break;
  case 'Paper':
    hargaPerKg = 5000;
    break;
  case 'Organik':
    hargaPerKg = 3000;
    break;
  default:
    hargaPerKg = 0;
}

try {
  const order = await transaksi.create({
    id: orders.length + 1,
    username,
    jenis_sampah,
    hargaPerKg,
    berat_sampah,
    points,
    lokasi_pengepul,
    lokasi_user,
    catatan
  });

  order.push(order);
  res.status(201).json(order);
} catch (error) {
  res.status(500).json({ error: 'Internal server error' });
}
});
//Start server
module.exports = router;