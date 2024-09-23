import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { parse } from 'date-fns';
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

  useEffect(() => {
    fetch('http://localhost:5000/api/diary')
      .then((response) => response.json())
      .then((data) => setDiaryData(data))
      .catch((error) => console.error('Error fetching diary data:', error));
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);
  startOfWeek.setHours(0, 0, 0, 0);

  const dateFormat = 'yyyy-MM-dd HH:mm'; // Using ISO format for consistency

  const filteredDiaryData = diaryData.filter((entry) => {
    const entryDate = parse(`${entry.date} ${entry.time || '00:00'}`, 'yyyy-MM-dd HH:mm', new Date());
    entryDate.setHours(0, 0, 0, 0);
    return entryDate >= startOfWeek;
  });

  console.log('Filtered Diary Data:', filteredDiaryData);

  const data = {
    labels: filteredDiaryData.map((entry) =>
      parse(`${entry.date} ${entry.time || '00:00'}`, dateFormat, new Date())
    ),
    datasets: [
      {
        label: 'Current Blood Glucose',
        data: filteredDiaryData.map((entry) => ({
          x: parse(`${entry.date} ${entry.time || '00:00'}`, dateFormat, new Date()),
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
            if (label) {
              return `${label}: ${context.raw.y}`;
            }
            return context.raw.y;
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
