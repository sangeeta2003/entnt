import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  ChatBubbleLeftRightIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Toast from '../../components/Toast';
import { communicationMethodService } from '../../services/communicationMethodService';

const CommunicationMethodManagement = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isMandatory: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMethod) {
        await handleUpdate(editingMethod._id, formData);
      } else {
        await handleCreate(formData);
      }
      setIsModalOpen(false);
      setFormData({ name: '', description: '', isMandatory: false });
      setEditingMethod(null);
    } catch (error) {
      setNotification({ type: 'error', message: error.message });
    }
  };

  const handleCreate = async (methodData) => {
    try {
      const newMethod = await communicationMethodService.createMethod({
        ...methodData,
        sequence: methods.length + 1
      });
      setNotification({ type: 'success', message: 'Method created successfully' });
      await fetchMethods();
    } catch (error) {
      setNotification({ type: 'error', message: error.message });
    }
  };

  const handleUpdate = async (id, methodData) => {
    try {
      await communicationMethodService.updateMethod(id, methodData);
      setNotification({ type: 'success', message: 'Method updated successfully' });
      await fetchMethods();
    } catch (error) {
      setNotification({ type: 'error', message: error.message });
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await communicationMethodService.deleteMethod(id);
      // Refresh the list after deletion
      fetchMethods();
      setNotification({
        type: 'success',
        message: 'Communication method deleted successfully'
      });
    } catch (error) {
      console.error('Delete error:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Error deleting communication method'
      });
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(methods);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedMethods = items.map((item, index) => ({
      id: item._id,
      sequence: index + 1
    }));

    try {
      await communicationMethodService.reorderMethods(updatedMethods);
      setNotification({ type: 'success', message: 'Methods reordered successfully' });
      await fetchMethods();
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to reorder methods' });
    }
  };

  const fetchMethods = async () => {
    try {
      setLoading(true);
      const fetchedMethods = await communicationMethodService.getMethods();
      setMethods(fetchedMethods);
      setError(null);
    } catch (error) {
      setError(error.message);
      setNotification({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-600 p-4">
      Error: {error}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Communication Methods
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and order your communication methods
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingMethod(null);
            setFormData({ name: '', description: '', isMandatory: false });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Method
        </motion.button>
      </div>

      {/* Methods List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="methods">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {methods.map((method, index) => (
                <Draggable 
                  key={method._id}
                  draggableId={method._id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <motion.div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 ${
                        snapshot.isDragging ? 'shadow-lg' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="cursor-move">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {method.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {method.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {method.isMandatory ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" title="Mandatory" />
                          ) : (
                            <XCircleIcon className="h-5 w-5 text-gray-400" title="Optional" />
                          )}
                          <button
                            onClick={() => {
                              setEditingMethod(method);
                              setFormData({
                                name: method.name,
                                description: method.description,
                                isMandatory: method.isMandatory
                              });
                              setIsModalOpen(true);
                            }}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(method._id)}
                            className="text-red-400 hover:text-red-500"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {editingMethod ? 'Edit Method' : 'Add New Method'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Method Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isMandatory"
                    checked={formData.isMandatory}
                    onChange={(e) => setFormData({ ...formData, isMandatory: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isMandatory" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Mandatory in sequence
                  </label>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingMethod ? 'Update Method' : 'Add Method'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </motion.div>
  );
};

export default CommunicationMethodManagement; 