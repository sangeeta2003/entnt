import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { SwatchIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { userDashboardService } from '../../services/userDashboardService';

const HighlightPreferences = ({ communication, isOpen, onClose, onUpdate }) => {
  const [preferences, setPreferences] = useState({
    disabled: communication?.highlightPreferences?.disabled || false,
    overrideColor: communication?.highlightPreferences?.overrideColor || 'none'
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await userDashboardService.updateHighlightPreferences(
        communication._id,
        preferences
      );
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          
          <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
            <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
              Highlight Preferences
            </Dialog.Title>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Disable Highlights
                </label>
                <input
                  type="checkbox"
                  checked={preferences.disabled}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    disabled: e.target.checked
                  }))}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              {!preferences.disabled && (
                <div className="space-y-2">
                  <label className="block text-sm text-gray-700 dark:text-gray-300">
                    Override Color
                  </label>
                  <select
                    value={preferences.overrideColor}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      overrideColor: e.target.value
                    }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="none">Default</option>
                    <option value="red">Red</option>
                    <option value="yellow">Yellow</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                  </select>
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-gray-800 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default HighlightPreferences; 