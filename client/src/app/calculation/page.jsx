'use client';
import Calculation from '../../components/Calculation';
import NavBar from '../../components/nav/NavBar';

export default function Calculations(){
  return (
    <div>
      <NavBar />
    <div className='py-16 px-16'>
        <div className='pb-8'>
      <h1 className='text-5xl'>Calculations</h1>
      </div>
      <Calculation />
      <div className='text-center'>
      <a className = 'text-gray-400 hover:text-white' href='/diary'>To Diary</a>
      </div>
    </div>
    </div>
  );
};


