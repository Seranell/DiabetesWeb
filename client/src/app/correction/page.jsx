'use client';
import CorrectionValues from '../../components/CorrectionValues';
import NavBar from '../../components/nav/NavBar';

export default function Correction(){
  return (
    <div>
      <NavBar />
    <div className='px-16 py-16'>
      <h1 className='text-5xl'>Correction Values</h1>
      <CorrectionValues />
      <div className='text-center'>
      <a className='text-gray-400 hover:text-white' href = './calculation'>Calculations</a>
      </div>
    </div>
    </div>
  );
};
