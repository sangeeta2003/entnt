const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const CommunicationMethod = require('../models/CommunicationMethod');

// Protect all routes with auth middleware
router.use(auth);

// Get all communication methods
router.get('/', async (req, res) => {
  try {
    const methods = await CommunicationMethod.find()
      .sort('sequence');
    res.json(methods);
  } catch (error) {
    console.error('Error fetching methods:', error);
    res.status(500).json({ message: 'Error fetching communication methods' });
  }
});

// Create a new communication method
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const method = new CommunicationMethod({
      name,
      description,
      isActive
    });
    await method.save();
    res.status(201).json(method);
  } catch (error) {
    console.error('Error creating method:', error);
    res.status(500).json({ message: 'Error creating communication method' });
  }
});

// Update a communication method
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const method = await CommunicationMethod.findByIdAndUpdate(
      req.params.id,
      { name, description, isActive },
      { new: true }
    );
    if (!method) {
      return res.status(404).json({ message: 'Communication method not found' });
    }
    res.json(method);
  } catch (error) {
    console.error('Error updating method:', error);
    res.status(500).json({ message: 'Error updating communication method' });
  }
});

// Delete a communication method
router.delete('/:id', auth, async (req, res) => {
  try {
    const method = await CommunicationMethod.findById(req.params.id);
    if (!method) {
      return res.status(404).json({ message: 'Communication method not found' });
    }
    await method.remove();
    res.json({ message: 'Communication method deleted successfully' });
  } catch (error) {
    console.error('Error deleting method:', error);
    res.status(500).json({ message: 'Error deleting communication method' });
  }
});

module.exports = router; 