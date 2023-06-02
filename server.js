const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// data for orders
let orders = [
  { id: 1, user: 'Rereee', wasteType: 'MInyak_jelantah', weight: 10, points: 35 },
  { id: 2, user: 'Rahma', wasteType: 'Organik', weight: 6, points: 11 },
  { id: 3, user: 'David', wasteType: 'Kertas', weight: 2, points: 4 },
  { id: 3, user: 'Damay', wasteType: 'Kaca', weight: 2, points: 4 },
  { id: 4, user: 'Brian', wasteType: 'Plastik', weight: 7, points: 14 },
  { id: 5, user: 'Ahmad', wasteType: 'Kabel_bekas', weight: 3, points: 22 },
];

// Mapping of waste types to points
const wastePoints = {
  Plastik: 10,
  Kaca: 6,
  Kertas: 4,
  Minyak_jelantah: 15,
  Organik: 2,
  Kabel_bekas: 23,
};

app.use(bodyParser.json());

// GET request (GET /orders) for get a list of all orders
app.get('/orders', (req, res) => {
    res.json(orders);
  });

// GET (GET /orders/:id) endpoint to obtain/retrieve a specific order by ID order 
app.get('/orders/:id', (req, res) => {
  const orderId = parseInt(req.params.id);
  const order = orders.find(order => order.id === orderId);

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

// POST /orders - Create a new order
app.post('/orders', (req, res) => {
  const { user, wasteType, weight } = req.body;

// Generate a new unique ID for the order
  const newOrderId = orders.length > 0 ? orders[orders.length - 1].id + 1 : 1;

  const points = calculatePoints(wasteType, weight);

  const newOrder = {
    id: newOrderId,
    user,
    wasteType,
    weight,
    points,
  };

  orders.push(newOrder);

  res.status(201).json(newOrder);
});


// PUT /orders/:id - Update an existing order
app.put('/orders/:id', (req, res) => {
  const orderId = parseInt(req.params.id);
  const { user, wasteType, weight } = req.body;

  const order = orders.find(order => order.id === orderId);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const points = calculatePoints(wasteType, weight);

  order.user = user;
  order.wasteType = wasteType;
  order.weight = weight;
  order.points = points;

  res.json(order);
});

// DELETE /orders/:id - Delete an existing order
app.delete('/orders/:id', (req, res) => {
  const orderId = parseInt(req.params.id);

  const orderIndex = orders.findIndex(order => order.id === orderId);
  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const deletedOrder = orders.splice(orderIndex, 1)[0];

  res.json({ message: 'Order deleted successfully', order: deletedOrder });
});

// GET /users/:user/totalPoints - Get the total points earned by a user
app.get('/users/:user/totalPoints', (req, res) => {
  const user = req.params.user;

  const userOrders = orders.filter((o) => o.user === user);

  const totalPoints = userOrders.reduce((sum, order) => sum + order.points, 0);

  res.json({ user, totalPoints });
});

// Helper function to calculate points based on waste type and weight
function calculatePoints(wasteType, weight) {
  const pointsPerUnit = wastePoints[wasteType];
  if (!pointsPerUnit) {
    return 0; // Invalid waste type
  }

  return weight * pointsPerUnit;
} 

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
