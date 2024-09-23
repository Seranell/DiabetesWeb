'use client';
import Diary from '../../components/Diary';
import NavBar from '../../components/nav/NavBar';

export default function DiaryPage(){
  return (
    <div>
        <NavBar />
    
      <h1 className='text-5xl text-center'>Diary</h1>
      <Diary />
    
    </div>
  );
};
