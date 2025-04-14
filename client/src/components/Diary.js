'use client';
import { useState, useEffect } from 'react';
import { db, auth } from '../../firebaseConfig';
import { doc, collection, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const Diary = () => {
  const [entries, setEntries] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editedEntry, setEditedEntry] = useState({});
  const [newEntry, setNewEntry] = useState({
    timestamp: '',
    selectedMeal: '',
    carbEntries: [],
    currentBG: '',
    correctionDose: '',
    carbDose: '',
    totalInsulinDose: '',
    notes: '',
  });
  const [isAdding, setIsAdding] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchEntries(user.uid);
      }
    });
  }, []);

  const fetchEntries = async (uid) => {
    try {
      const diaryRef = collection(db, 'users', uid, 'diary');
      const snapshot = await getDocs(diaryRef);
      const fetchedEntries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedEntries = fetchedEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setEntries(sortedEntries);
    } catch (error) {
      console.error('Error fetching diary entries:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', userId, 'diary', id));
      setEntries(entries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleEdit = (index) => {
    setIsEditing(index);
    setEditedEntry({ ...entries[index] });
  };

  const saveEdit = async () => {
    try {
      const docRef = doc(db, 'users', userId, 'diary', editedEntry.id);
      await updateDoc(docRef, { notes: editedEntry.notes });
      fetchEntries(userId);
      setIsEditing(null);
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const handleAddEntry = async () => {
    try {
      const docRef = doc(collection(db, 'users', userId, 'diary'));
      await setDoc(docRef, newEntry);
      fetchEntries(userId);
      setNewEntry({ timestamp: '', selectedMeal: '', carbEntries: [], currentBG: '', correctionDose: '', carbDose: '', totalInsulinDose: '', notes: '' });
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  const openAddEntryForm = () => {
    const now = new Date();
    setNewEntry({
      timestamp: now.toISOString(),
      selectedMeal: '',
      carbEntries: [],
      currentBG: '',
      correctionDose: '',
      carbDose: '',
      totalInsulinDose: '',
      notes: '',
    });
    setIsAdding(true);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (value) => {
    setEditedEntry((prev) => ({ ...prev, notes: value }));
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Invalid Date';
    try {
      return new Date(timestamp).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  const renderEntryField = (label, value) => {
    if (value) {
      return (
        <p>
          <strong>{label}:</strong> {value}
        </p>
      );
    }
    return null;
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-6">
        {!isAdding ? (
          <button
            type="button"
            onClick={openAddEntryForm}
            className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
          >
            Add New Entry
          </button>
        ) : (
          <div>
            <h3 className="text-2xl font-bold mb-4">New Entry</h3>
            <input
              type="date"
              name="date"
              value={newEntry.timestamp}
              onChange={handleAddChange}
              className="w-full mb-2 px-2 py-1 border rounded-lg"
              disabled 
            />
            <input
              type="time"
              name="time"
              value={newEntry.timestamp}
              onChange={handleAddChange}
              className="w-full mb-2 px-2 py-1 border rounded-lg"
              disabled 
            />
            <input
              type="text"
              name="currentBG"
              value={newEntry.currentBG}
              onChange={handleAddChange}
              placeholder="Blood Sugar"
              className="w-full mb-2 px-2 py-1 border rounded-lg"
            />
            <textarea
              name="notes"
              value={newEntry.notes}
              onChange={handleAddChange}
              placeholder="Notes"
              className="w-full mb-2 px-2 py-1 border rounded-lg"
            />
            <button
              type="button"
              onClick={handleAddEntry}
              className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 mr-2"
            >
              Save Entry
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {entries.length === 0 ? (
        <p>No diary entries found.</p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, index) => {
            const entryDate = formatDate(entry.timestamp);
            const todayDate = new Date().toLocaleDateString();
            const isToday = entryDate === todayDate;
            const time = entry.time;

            return (
              <div key={entry.id}>
                <div
                  className={`px-4 w-1/2 border border-gray-300 rounded-t-lg ${
                    isToday ? 'bg-green-400' : 'bg-red-500'
                  }`}
                >
                  <h4 className="text-xl text-black px-4">
                    <strong>{entryDate}</strong>
                  </h4>
                </div>
                <div className="p-4 border border-gray-300 rounded-tl-none rounded-lg">
                  <h5 className="text-xl border border-gray-300 px-2">{time}</h5>
                  {isEditing === index ? (
                    <>
                      <textarea
                        value={editedEntry.notes}
                        onChange={(e) => handleEditChange(e.target.value)}
                        placeholder="Notes"
                        className="w-full px-2 py-1 border mb-2 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={saveEdit}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 mr-2"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {renderEntryField('Meal', entry.selectedMeal)}
                      {renderEntryField('Carb Entries', entry.carbEntries.map((item) => `${item.foodItem} - ${item.amount}g`).join(', ') || 'N/A')}
                      {renderEntryField('Blood Sugar', entry.currentBG)}
                      {renderEntryField('Correction Dose', entry.correctionDose)}
                      {renderEntryField('Carb Dose', entry.carbDose)}
                      {renderEntryField('Total Insulin Dose', entry.totalInsulinDose)}
                      {renderEntryField('Notes', entry.notes)}
                      <button
                        type="button"
                        onClick={() => handleEdit(index)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(entry.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Diary;
