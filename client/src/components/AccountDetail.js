import { useState, useEffect } from 'react';
import { db, auth, provider, signOut } from '../../../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const AccountDetails = () => {
  const [correctionValues, setCorrectionValues] = useState({});
  const [mealValues, setMealValues] = useState({});
  const [targetBlood, setTargetBlood] = useState(null);
  const [penType, setPenType] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [tempCorrectionValues, setTempCorrectionValues] = useState({});
  const [tempMealValues, setTempMealValues] = useState({});
  const [tempTargetBlood, setTempTargetBlood] = useState('');
  const [tempPenType, setTempPenType] = useState('');

  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setUser({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        });
      } else {
        setUserId(null);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        const correctionDoc = await getDoc(doc(db, 'users', userId, 'correctionValues', 'data'));
        const mealDoc = await getDoc(doc(db, 'users', userId, 'mealValues', 'data'));

        if (correctionDoc.exists()) {
          const data = correctionDoc.data();
          setCorrectionValues(data);
          setTargetBlood(data.targetBlood);
          setPenType(data.penType);
        }

        if (mealDoc.exists()) {
          setMealValues(mealDoc.data());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]);

  const handleEditClick = () => {
    setTempCorrectionValues(correctionValues);
    setTempMealValues(mealValues);
    setTempTargetBlood(targetBlood);
    setTempPenType(penType);
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    if (!userId) return;

    try {
      await setDoc(doc(db, 'users', userId, 'correctionValues', 'data'), {
        ...tempCorrectionValues,
        targetBlood: parseFloat(tempTargetBlood),
        penType: tempPenType,
      }, { merge: true });

      await setDoc(doc(db, 'users', userId, 'mealValues', 'data'), tempMealValues, { merge: true });

      setCorrectionValues(tempCorrectionValues);
      setMealValues(tempMealValues);
      setTargetBlood(parseFloat(tempTargetBlood));
      setPenType(tempPenType);
      setEditMode(false);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout Error:', error);
      alert(`Error signing out: ${error.message}`);
    }
  };

  const handleCancelClick = () => {
    setEditMode(false);
  };

  return (
    <div className="max-w-md p-4">
      {user && (
        <div className="mb-4 text-center">
          <img src={user.photo} alt="User Photo" className="rounded-full w-16 h-16 mx-auto mb-2" />
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-2"
          >
            Sign Out
          </button>
        </div>
      )}

      <h3 className="text-4xl mb-2">Correction Ratios</h3>
      <div className="px-5 text-xl">
        {['breakfastI', 'lunchI', 'dinnerI', 'supperI'].map((key) => (
          <div key={key} className="mb-2">
            <label>{key.replace('I', '')}: </label>
            {editMode ? (
              <input
                type="number"
                value={tempCorrectionValues[key] || ''}
                onChange={(e) => setTempCorrectionValues({ ...tempCorrectionValues, [key]: parseFloat(e.target.value) })}
              />
            ) : (
              <span>{correctionValues[key]}</span>
            )}
          </div>
        ))}
      </div>

      <h3 className="text-4xl mb-2">Carb Ratios</h3>
      <div className="px-5 text-xl">
        {['breakfast', 'lunch', 'dinner', 'supper'].map((key) => (
          <div key={key} className="mb-2">
            <label>{key}: </label>
            {editMode ? (
              <input
                type="number"
                value={tempMealValues[key] || ''}
                onChange={(e) => setTempMealValues({ ...tempMealValues, [key]: parseFloat(e.target.value) })}
              />
            ) : (
              <span>{mealValues[key]}</span>
            )}
          </div>
        ))}
      </div>

      <h3 className="text-4xl mb-2">Target Blood Glucose</h3>
      {editMode ? (
        <input
          type="number"
          value={tempTargetBlood}
          onChange={(e) => setTempTargetBlood(e.target.value)}
        />
      ) : (
        <span className='block text-lg font-medium mb-1'>{targetBlood}</span>
      )}

      <h3 className="text-4xl mb-2">Pen Type</h3>
      {editMode ? (
        <select value={tempPenType} onChange={(e) => setTempPenType(e.target.value)}>
          <option value="child">Child</option>
          <option value="adult">Adult</option>
        </select>
      ) : (
        <span>{penType}</span>
      )}

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