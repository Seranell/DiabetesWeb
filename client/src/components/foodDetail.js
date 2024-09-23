'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const FoodDetail = () => {
  const [food, setFood] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Use router.query to get the dynamic route parameter

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:5000/api/food/${id}`) // Replace with your API URL
      .then(response => response.json())
      .then(data => {
        setFood(data); // Assuming data contains the full food object
      })
      .catch(error => {
        setError(error);
        console.error('Error:', error);
      });
  }, [id]);

  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (!food) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg bg-gray-800">
        <h1 className="text-3xl font-bold mb-4 text-white">{food.name}</h1>
        {food.image && (
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-64 object-cover mb-4 rounded-lg"
          />
        )}
        <div className="text-white mb-4">
          <p><strong>Energy:</strong> {food.nutritional_values.energy || 'N/A'}</p>
          <p><strong>Protein:</strong> {food.nutritional_values.protein?.replace('g', '').trim() || 'N/A'}g</p>
          <p><strong>Carbs:</strong> {food.nutritional_values.carbohydrate?.replace('g', '').trim() || 'N/A'}g</p>
          <p><strong>Fat:</strong> {food.nutritional_values.fat?.replace('g', '').trim() || 'N/A'}g</p>
        </div>
        <div className="mt-4">
          <h2 className="text-2xl font-semibold text-white">Ingredients</h2>
          <ul className="list-disc ml-6 mt-2 text-white">
            {food.ingredients?.split(',').map((ingredient, index) => (
              <li key={index} className="text-white">{ingredient.trim()}</li>
            )) || 'N/A'}
          </ul>
        </div>
        <div className="mt-4">
          <h2 className="text-2xl font-semibold text-white">Dietary Information</h2>
          <p className="text-white">{food.dietary_information || 'N/A'}</p>
        </div>
        <div className="mt-4">
          <h2 className="text-2xl font-semibold text-white">Additional Info</h2>
          <p className="text-white">{food.additional_info?.reference_intake_note || 'N/A'}</p>
          <p className="text-white">Portion Count: {food.additional_info?.portion_count || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
