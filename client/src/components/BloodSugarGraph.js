import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { parseISO } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Graph = () => {
  const [diaryData, setDiaryData] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchDiary = async (uid) => {
      try {
        const diaryRef = collection(db, 'users', uid, 'diary');
        const snapshot = await getDocs(diaryRef);
        const data = snapshot.docs
          .map(doc => doc.data())
          .filter(entry => entry.currentBG !== undefined && entry.timestamp)
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        setDiaryData(data);
      } catch (error) {
        console.error('Error fetching diary data:', error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchDiary(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);

  const filteredDiaryData = diaryData.filter((entry) => {
    const entryDate = parseISO(entry.timestamp);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate >= startOfWeek;
  });

  const data = {
    datasets: [
      {
        label: 'Current Blood Glucose',
        data: filteredDiaryData.map((entry) => ({
          x: parseISO(entry.timestamp),
          y: entry.currentBG,
        })),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'PPpp',
          displayFormats: {
            day: 'MMM d',
          },
        },
        min: startOfWeek,
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        beginAtZero: true,
        min: 1,
        max: 20,
        title: {
          display: true,
          text: 'Blood Glucose Level',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            return label ? `${label}: ${context.raw.y}` : context.raw.y;
          },
        },
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Blood Glucose Graph</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default Graph;
