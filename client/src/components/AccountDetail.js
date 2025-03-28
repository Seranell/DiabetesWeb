import { useState, useEffect } from 'react';

const AccountDetails = () => {
  const [correctionValues, setCorrectionValues] = useState({});
  const [mealValues, setMealValues] = useState({});
  const [targetBlood, settargetBlood] = useState(null);
  const [penType, setPenType] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [tempCorrectionValues, setTempCorrectionValues] = useState({});
  const [tempMealValues, setTempMealValues] = useState({});
  const [temptargetBlood, setTemptargetBlood] = useState('');
  const [tempPenType, setTempPenType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const correctionResponse = await fetch('https://diabetesweb-backend.onrender.com/api/correction-values');
        if (!correctionResponse.ok) throw new Error('Failed to fetch correction values');
        const correctionData = await correctionResponse.json();
        
        setCorrectionValues(correctionData);
        settargetBlood(correctionData.targetBlood || '');
        setPenType(correctionData.penType || '');

        const mealResponse = await fetch('https://diabetesweb-backend.onrender.com/api/meal-values');
        if (!mealResponse.ok) throw new Error('Failed to fetch meal values');
        const mealData = await mealResponse.json();
        setMealValues(mealData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = () => {
    setTempCorrectionValues(correctionValues);
    setTempMealValues(mealValues);
    setTemptargetBlood(targetBlood || '');
    setTempPenType(penType);
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    try {
      await fetch('https://diabetesweb-backend.onrender.com/api/correction-values', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...tempCorrectionValues,
          targetBlood: temptargetBlood,
          penType: tempPenType,
        }),
      });

      await fetch('https://diabetesweb-backend.onrender.com/api/meal-values', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tempMealValues),
      });

      setCorrectionValues(tempCorrectionValues);
      setMealValues(tempMealValues);
      settargetBlood(parseFloat(temptargetBlood));
      setPenType(tempPenType);
      setEditMode(false);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleCancelClick = () => {
    setTempCorrectionValues(correctionValues);
    setTempMealValues(mealValues);
    setTemptargetBlood(targetBlood || '');
    setTempPenType(penType);
    setEditMode(false);
  };

  return (
    <div className="max-w-md p-4">
      <div className="mb-4">
        <h3 className="text-4xl mb-2">Correction Ratios</h3>
        <div className="px-5 text-xl flex space-x-4">
          {['breakfastI', 'lunchI', 'dinnerI', 'supperI'].map((correction) => (
            <div key={correction} className="text-left">
              <div className="font-medium">
                {correction.charAt(0).toUpperCase() + correction.slice(1).replace('I', '')}
              </div>
              {editMode ? (
                <input
                  type="number"
                  value={tempCorrectionValues[correction] || ''}
                  onChange={(e) =>
                    setTempCorrectionValues({
                      ...tempCorrectionValues,
                      [correction]: parseFloat(e.target.value),
                    })
                  }
                  className="mt-1 p-1 border border-gray-300 rounded"
                />
              ) : (
                <div>{correctionValues[correction] || 'N/A'}</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-4xl mb-2">Carb Ratios</h3>
        <div className="px-5 text-xl flex space-x-4">
          {['breakfast', 'lunch', 'dinner', 'supper'].map((meal) => (
            <div key={meal} className="text-left">
              <div className="font-medium">{meal.charAt(0).toUpperCase() + meal.slice(1)}</div>
              {editMode ? (
                <input
                  type="number"
                  value={tempMealValues[meal] || ''}
                  onChange={(e) =>
                    setTempMealValues({
                      ...tempMealValues,
                      [meal]: parseFloat(e.target.value),
                    })
                  }
                  className="mt-1 p-1 border border-gray-300 rounded"
                />
              ) : (
                <div>{mealValues[meal] || 'N/A'}</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-4xl mb-2">Target Blood Glucose</h3>
        <div className="text-lg">
          {editMode ? (
            <input
              type="number"
              value={temptargetBlood}
              onChange={(e) => setTemptargetBlood(e.target.value)}
              className="p-1 border border-gray-300 rounded"
            />
          ) : (
            <div className='px-5 text-xl'>{targetBlood || 'N/A'}</div>
          )}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-4xl mb-2">Pen Type</h3>
        <div className="text-lg">
          {editMode ? (
            <select
              value={tempPenType}
              onChange={(e) => setTempPenType(e.target.value)}
              className="p-1 border border-gray-300 rounded"
            >
              <option value="child">Child</option>
              <option value="adult">Adult</option>
            </select>
          ) : (
            <div className='px-5 text-xl'>{penType.charAt(0).toLowerCase() + penType.slice(1) || 'N/A'}</div>
          )}
        </div>
      </div>
      <div className="flex space-x-4">
        {editMode ? (
          <>
            <button
              onClick={handleSaveClick}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={handleCancelClick}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={handleEditClick}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default AccountDetails;
