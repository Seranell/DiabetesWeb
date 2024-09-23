'use client';

import NavBar from '../../components/nav/NavBar';
import RecipeSearch from '../../components/recipeSearch';

export default function Recipes(){
  return (
    <div>
        <NavBar />
        <h1 className="text-5xl pt-4 px-16">Recipe Search</h1>
      <RecipeSearch />
    </div>
  );
}
