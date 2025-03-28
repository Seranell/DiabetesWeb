'use client';
import { useState, useEffect } from 'react';

const Diary = () => {
  const [entries, setEntries] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editedEntry, setEditedEntry] = useState({});
  const [newEntry, setNewEntry] = useState({
    date: '',
    time: '',
    notes: '',
    currentBG: '',
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetch('https://diabetesweb-backend.onrender.com/api/diary')
      .then((response) => response.json())
      .then((data) => {
        const sortedEntries = data.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          const timeA = new Date(`${a.date} ${a.time}`); 
          const timeB = new Date(`${b.date} ${b.time}`);

          if (dateA > dateB) return -1;
          if (dateA < dateB) return 1;

          return timeB - timeA;
        });
        setEntries(sortedEntries);
      })
      .catch((error) => console.error('Error fetching diary entries:', error));
  }, []);

  const handleDelete = (id) => {
    fetch(`https://diabetesweb-backend.onrender.com/api/diary/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedEntries = entries.filter((entry) => entry.id !== id);
        setEntries(updatedEntries);
      })
      .catch((error) => console.error('Error deleting diary entry:', error));
  };

  const handleEdit = (index) => {
    setIsEditing(index);
    setEditedEntry({ ...entries[index] });
  };

  const handleEditChange = (value) => {
    setEditedEntry((prev) => ({ ...prev, notes: value }));
  };

  const saveEdit = () => {
    fetch(`https://diabetesweb-backend.onrender.com/api/diary/${editedEntry.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notes: editedEntry.notes }),
    })
      .then((response) => response.json())
      .then((updatedEntry) => {
        const updatedEntries = entries.map((entry, index) =>
          index === isEditing ? updatedEntry : entry
        );
        updatedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
        setEntries(updatedEntries);
        setIsEditing(null);
      })
      .catch((error) => console.error('Error saving diary entry:', error));
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEntry = () => {
    fetch('https://diabetesweb-backend.onrender.com/api/diary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEntry),
    })
      .then((response) => response.json())
      .then((addedEntry) => {
        const updatedEntries = [addedEntry, ...entries];
        setEntries(updatedEntries);
        setNewEntry({ date: '', time: '', notes: '', currentBG: '' });
        setIsAdding(false);
      })
      .catch((error) => console.error('Error adding diary entry:', error));
  };

  const openAddEntryForm = () => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].slice(0, 5);
    setNewEntry({ date: currentDate, time: currentTime, notes: '', currentBG: '' });
    setIsAdding(true);
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
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
              value={newEntry.date}
              onChange={handleAddChange}
              className="w-full mb-2 px-2 py-1 border rounded-lg"
              disabled 
            />
            <input
              type="time"
              name="time"
              value={newEntry.time}
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
            const entryDate = formatDate(entry.date);
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
                  <h5 className='text-xl border border-gray-300 px-2'>{time}</h5>
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
                      {renderEntryField('Meal', entry.meal)}
                      {renderEntryField('Food Eaten', entry.food)}
                      {renderEntryField('Carbs', entry.carbs)}
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
