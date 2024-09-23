'use client';
import MealValues from '../../components/MealValues';
import NavBar from '../../components/nav/NavBar';

export default function Carb(){
  return (
    <div>
      <NavBar />
    <div className='py-16 px-16'>
        <h1 className='text-5xl'>Carb Ratio</h1>
      <MealValues />
      <div className='text-center'>
      <a className='text-gray-400 hover:text-white' href = './correction'>Corrections</a>
      </div>
    </div>
    </div>
  );
};
