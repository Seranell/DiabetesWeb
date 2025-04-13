'use client';
import MealValues from '../../components/MealValues';
import NavBar from '../../components/nav/NavBar';
import PrivacyPolicyModal from '../../components/PrivacyPolicy';

export default function Carb(){
  return (
    <div>
      <PrivacyPolicyModal />
    <div className='py-16 px-16'>
        <h1 className='text-5xl'>Carb Ratio</h1>
      <MealValues />
      <div className='text-center'>
      </div>
    </div>
    </div>
  );
};
