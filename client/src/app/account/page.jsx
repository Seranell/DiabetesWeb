'use client';

import NavBar from "../../components/nav/NavBar";
import AccountDetails from "../../components/AccountDetail";
import BloodSugarGraph from "../../components/BloodSugarGraph"

export default function Account(){

return (
    <div>
        <NavBar />
        <div className="py-16 px-16">
        <h1 className="text-5xl">Account</h1>
            <AccountDetails />
            <BloodSugarGraph />
        </div>
    </div>
)
}