const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.json());

const Validator = require('fastest-validator');

const {orders} = require('./models');

const v = new Validator();

//mulai//
//GET (buat dapetin semua list orderannya user) url: http://localhost:3000/order/orders
router.get('/orders', async (req, res) => {
  
  try {
    const order = await orders.findAll();
    res.json(order);
  } 
  catch (error) {
    res.status(500)
    .json({ error: 'Internal server error' });
  }
});

//GET (buat dapetin orderan by id) url: http://localhost:3000/order/orders/1
router.get('/orders/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const order = await orders.findByPk(id);
    if (!order) {
      res.status(404)
      .json({ error: 'Order tidak ditemukan' });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(500)
    .json({ error: 'Internal server error' });
  }
});

//GET (buat dapetin status delivery tukang pengepul sampah) url: http://localhost:3000/order/orders/1/lacak
router.get('/orders/:id/lacak', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    let order = await orders.findByPk(id);
    if (!order) {
      res.status(404).json({ error: 'Order tidak ditemukan' });
      return;
    }

    const status = order.isPickedUp ? 'Proses Pickup' : 'Pending pickup';
    res.json({ status });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//GET (buat dapetin total uang hasil user menjual barang2 bekas) url: http://localhost:3000/order/users/Zayn/price
router.get('/users/:username/price', async (req, res) => {
  const {username} = req.params;

  try {
    let pesananuser = await orders.findAll({ where: { username } });
    const total_income_jual_sampah = pesananuser.reduce((acc, order) => {
      const { jenis_sampah, berat_sampah, hargaPerKg } = order;
      return acc + berat_sampah * hargaPerKg;
    }, 0);

    res.json({ total_income_jual_sampah });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET (buat dapetin total pendapatan points tiap2 user) url: http://localhost:3000/order/users/Zayn/totalpoints
router.get('/users/:username/totalpoints', async (req, res) => {
  const {username} = req.params;

  try {
    let pesananuser = await orders.findAll({ where: { username } });
    const totalPoints = pesananuser.reduce((acc, order) => {
      const { berat_sampah, points } = order;
      return acc + berat_sampah * points;
    }, 0);

    res.json({ totalPoints });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//POST (buat orderan baru) url: http://localhost:3000/order/orders
router.post('/orders', async(req, res) => {
const schema = {
  username:'string|min: 1',
  jenis_sampah: 'string|min: 1',
  berat_sampah: 'number|positive',
  lokasi_pengepul: 'string|min: 1',
  lokasi_user: 'string|min: 1',
  catatan: 'string|optional'
}

// validasi body request
const validate = v.validate (req.body, schema);

if (validate.length){
  return res.status(400)
  .json(validate);
}

const { username, jenis_sampah, berat_sampah, lokasi_pengepul, lokasi_user, catatan } = req.body;

  // kalkulasi reward points sama hargaPerKg
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
    const order = await orders.create({
      username,
      jenis_sampah,
      hargaPerKg,
      berat_sampah,
      points,
      lokasi_pengepul,
      lokasi_user,
      catatan
    });

    res.status(201)
    .json({message: 'Order kamu berhasil!', data:order});
  } catch (error) {
    console.error(error);
    res.status(500)
    .json({ error: 'Internal server error' });
  }

});

// POST (buat menyelesaikan transaksi orderan) url: http://localhost:3000/order/orders/1/complete
router.post('/orders/:id/complete', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const order = await orders.findByPk(id);
    if (!order) {
      res.status(404).json({ error: 'Order tidak ditemukan' });
      return;
    }

    order.isPickedUp = true;
    await order.save();

    res.json({ message: 'Transaksi berhasil! Tunggu yaaa, pengepul sampah kamu lagi di jalan menuju rumahmu', data:order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT (buat update/perbaharuin orderan by id) url: http://localhost:3000/order/orders/1
router.put('/orders/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  
  const schema = {
    username:'string|min: 1',
    jenis_sampah: 'string|min: 1',
    berat_sampah: 'number|positive',
    lokasi_pengepul: 'string|min: 1',
    lokasi_user: 'string|min: 1',
    catatan: 'string|optional'
  }

  // validasi body request
  const validate = v.validate (req.body, schema);

  if (validate.length){
    return res.status(400)
    .json(validate);
  }

  try {
    let order = await orders.findByPk(id);
    if (!order) {
      res.status(404)
      .json({ error: 'Order tidak ditemukan' });
      return;
    }

    order = await order.update(req.body);

    res.json({message: 'Order kamu berhasil diupdate!', data:order});
  } catch (error) {
    res.status(500)
    .json({ error: 'Internal server error' });
  }
});

//DELETE (buat menghapus orderan by id) url: http://localhost:3000/order/orders/1
router.delete('/orders/:id', async (req, res) => {
  const id = parseInt(req.params.id);
    let order = await orders.findByPk(id);
    if (!order) {
      res.status(404)
      .json({ error: 'Order tidak ditemukan' });
      return;
    }
    await order.destroy();
    res.json({ message: 'Order kamu berhasil dihapus'});
  });
//selesai

module.exports = router;