'use client'

import NavBar from "../../components/nav/NavBar"

export default function Hypo(){
    return(
        <div>
            <NavBar />
        <div className="py-16 px-16">
            <h1 className="text-5xl pb-10">Hypoglycaemia Treatment(Hypo)</h1>
            <div>
                <h2 className="text-3xl">How to treat a Hypo</h2>
                <div className="py-10 px-5">
                <ol>
                    <li className = 'pb-5'>1. Drink 180ml of Lucozade or 150ml of full Sugar Coke, alternatively take 5 glucose or dextrose tablets, or 2 tubes of glucose gel.</li>
                    <li className = 'pb-5'>2. Check your blood again after 15 minutes</li>
                    <li className = 'pb-5'>3. If your blood sugar is still below 4, repeat step 1. If it still doesn't improve repeat once more.</li>
                    <li className = 'pb-5'>4. After blood sugar has improved, eat a biscuit to help slow blood sugars from increasing</li>
                </ol>
                </div>
            </div>
        </div>
        </div>
    )
}