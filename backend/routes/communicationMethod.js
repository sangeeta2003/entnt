const express = require('express');
const router = express.Router();
const CommunicationMethod = require('../models/CommunicationMethod');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const mongoose = require('mongoose');

// Get all communication methods
router.get('/', auth, async (req, res) => {
  try {
    const methods = await CommunicationMethod.find()
      .sort('sequence')
      .populate('createdBy', 'name')
      .populate('lastUpdatedBy', 'name');
    res.json(methods);
  } catch (error) {
    console.error('Error fetching communication methods:', error);
    res.status(500).json({ message: 'Error fetching communication methods' });
  }
});

// Create communication method (admin only)
router.post('/', [auth, isAdmin], async (req, res) => {
  try {
    // Start a session for transaction
    const session = await mongoose.startSession();
    let savedMethod;

    await session.withTransaction(async () => {
      // Get the highest sequence number
      const maxSequence = await CommunicationMethod.findOne()
        .sort('-sequence')
        .select('sequence');
      
      const nextSequence = (maxSequence?.sequence || 0) + 1;

      // If user provided a sequence number that's different from nextSequence,
      // we need to shift other methods
      if (req.body.sequence && req.body.sequence !== nextSequence) {
        // Move all methods with sequence >= requested sequence up by 1
        await CommunicationMethod.updateMany(
          { sequence: { $gte: req.body.sequence } },
          { $inc: { sequence: 1 } },
          { session }
        );
      }

      const method = new CommunicationMethod({
        ...req.body,
        sequence: req.body.sequence || nextSequence,
        createdBy: req.user._id,
        lastUpdatedBy: req.user._id
      });

      await method.save({ session });
      
      savedMethod = await method.populate([
        { path: 'createdBy', select: 'name' },
        { path: 'lastUpdatedBy', select: 'name' }
      ]);
    });

    await session.endSession();
    res.status(201).json(savedMethod);
  } catch (error) {
    console.error('Error creating communication method:', error);
    res.status(400).json({ 
      message: error.message || 'Error creating communication method',
      errors: error.errors
    });
  }
});

// Update communication method (admin only)
router.put('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const session = await mongoose.startSession();
    let updatedMethod;

    await session.withTransaction(async () => {
      const method = await CommunicationMethod.findById(req.params.id);
      if (!method) {
        throw new Error('Communication method not found');
      }

      // If sequence is being changed
      if (req.body.sequence && req.body.sequence !== method.sequence) {
        // Move other methods to make space
        if (req.body.sequence > method.sequence) {
          // Moving down - decrease sequence of methods in between
          await CommunicationMethod.updateMany(
            { 
              sequence: { 
                $gt: method.sequence, 
                $lte: req.body.sequence 
              } 
            },
            { $inc: { sequence: -1 } },
            { session }
          );
        } else {
          // Moving up - increase sequence of methods in between
          await CommunicationMethod.updateMany(
            { 
              sequence: { 
                $gte: req.body.sequence, 
                $lt: method.sequence 
              } 
            },
            { $inc: { sequence: 1 } },
            { session }
          );
        }
      }

      // Update the method
      Object.assign(method, {
        ...req.body,
        lastUpdatedBy: req.user._id
      });

      await method.save({ session });
      
      updatedMethod = await method.populate([
        { path: 'createdBy', select: 'name' },
        { path: 'lastUpdatedBy', select: 'name' }
      ]);
    });

    await session.endSession();
    res.json(updatedMethod);
  } catch (error) {
    console.error('Error updating communication method:', error);
    res.status(400).json({ 
      message: error.message || 'Error updating communication method',
      errors: error.errors
    });
  }
});

// Delete communication method (admin only)
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const method = await CommunicationMethod.findById(req.params.id);
    if (!method) {
      return res.status(404).json({ message: 'Communication method not found' });
    }

    // Check if method is mandatory
    if (method.isMandatory) {
      return res.status(400).json({ 
        message: 'Cannot delete a mandatory communication method' 
      });
    }

    await method.deleteOne();
    
    // Reorder remaining methods
    const remainingMethods = await CommunicationMethod.find()
      .sort('sequence');
    
    for (let i = 0; i < remainingMethods.length; i++) {
      remainingMethods[i].sequence = i + 1;
      await remainingMethods[i].save();
    }

    res.json({ 
      message: 'Communication method deleted successfully',
      deletedMethod: method
    });
  } catch (error) {
    console.error('Error deleting communication method:', error);
    res.status(500).json({ message: error.message });
  }
});

// Reorder communication methods (admin only)
router.post('/reorder', [auth, isAdmin], async (req, res) => {
  try {
    const { methods } = req.body; // Array of { id, sequence }
    
    // Validate input
    if (!Array.isArray(methods)) {
      return res.status(400).json({ message: 'Invalid input format' });
    }

    // Update all methods in a transaction
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      for (const item of methods) {
        await CommunicationMethod.findByIdAndUpdate(
          item.id,
          { 
            sequence: item.sequence,
            lastUpdatedBy: req.user._id
          }
        );
      }
    });
    
    const updatedMethods = await CommunicationMethod.find()
      .sort('sequence')
      .populate('createdBy', 'name')
      .populate('lastUpdatedBy', 'name');

    res.json(updatedMethods);
  } catch (error) {
    console.error('Error reordering methods:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 