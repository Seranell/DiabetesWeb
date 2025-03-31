'use client';

// import NavBar from "../components/nav/NavBar";
import AuthComponent from "../components/Auth";

export default function Welcome(){
    return(
    <div>
        {/* <NavBar />
    <div className = 'px-16 py-16'>
            <h1 className = 'text-6xl font-bold'>Welcome</h1>
            <h2 className = 'text-4xl'>Lets Get Started</h2>
            <a href = '/carb' className = 'button'>Next</a>
    </div>     */}
        <div>
      <AuthComponent />
    </div>
   </div>
    )
}