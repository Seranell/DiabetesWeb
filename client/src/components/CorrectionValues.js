import { useState, useEffect } from 'react';

const CorrectionValues = () => {
  const [correctionValues, setCorrectionValues] = useState({
    breakfastI: null,
    lunchI: null,
    dinnerI: null,
    supperI: null,
    targetBlood: null,
    penType: 'child', // Default to child pen
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch saved correction values and pen type from the API
    const fetchCorrectionValues = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/correction-values');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCorrectionValues(data);
      } catch (error) {
        console.error('Failed to fetch correction values:', error);
        setError('Failed to fetch correction values');
      }
    };

    fetchCorrectionValues();
  }, []);

  const handleChange = (event) => {
    const { id, value, type, checked } = event.target;
    setCorrectionValues((prevValues) => ({
      ...prevValues,
      [id]: type === 'radio' ? (checked ? id : prevValues[id]) : parseFloat(value) || null,
    }));
  };

  const saveCorrectionValues = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/correction-values', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(correctionValues),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      alert('Correction values saved successfully');
      setError(null); 
    } catch (error) {
      console.error('Failed to save correction values:', error);
      setError('Failed to save correction values');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-3xl mb-4">Enter Correction Values</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {['breakfastI', 'lunchI', 'dinnerI', 'supperI'].map((correction) => (
        <div key={correction} className="mb-4">
          <label htmlFor={correction} className="block text-lg font-medium mb-1">
            {correction.charAt(0).toUpperCase() + correction.slice(1).replace('I', '')}:
          </label>
          <input
            type="number"
            id={correction}
            value={correctionValues[correction] || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      ))}
      <div className="mb-4">
        <label htmlFor="targetBlood" className="block text-lg font-medium mb-1">
          Target Blood Glucose:
        </label>
        <input
          type="number"
          id="targetBlood"
          value={correctionValues.targetBlood || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg font-medium mb-1">Select Pen Type:</label>
        <div>
          <label className="mr-4">
            <input
              type="radio"
              id="adult"
              name="penType"
              checked={correctionValues.penType === 'adult'}
              onChange={handleChange}
            />
            <span className="ml-2">Adult Pen</span>
          </label>
          <label>
            <input
              type="radio"
              id="child"
              name="penType"
              checked={correctionValues.penType === 'child'}
              onChange={handleChange}
            />
            <span className="ml-2">Child Pen</span>
          </label>
        </div>
      </div>
      <button
        onClick={saveCorrectionValues}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Save Correction Values
      </button>
    </div>
  );
};

export default CorrectionValues;
