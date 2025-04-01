import { useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function AddFoodForm() {
    const [foodData, setFoodData] = useState({
        category: "Dairy",
        name: "",
        amount_per: "",
        energy: "",
        fat: "",
        saturates: "",
        carbohydrate: "",
        sugars: "",
        fibre: "",
        protein: "",
        salt: "",
        image: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFoodData({ ...foodData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Reference to collection based on category
            const docRef = await addDoc(collection(db, "food_data"), foodData);
            console.log("Document created with ID: ", docRef.id);
            alert("Food item added successfully!");

            // Reset form
            setFoodData({
                category: "Dairy",
                name: "",
                amount_per: "",
                energy: "",
                fat: "",
                saturates: "",
                carbohydrate: "",
                sugars: "",
                fibre: "",
                protein: "",
                salt: "",
                image: ""
            });
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <h1 className="text-2xl font-bold mb-4">Add Food Item</h1>

            <label className="block">
                <span className="text-gray-700">Category</span>
                <select name="category" value={foodData.category} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md">
                    <option value="Dairy">Dairy</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Bread">Bread</option>
                    <option value="Meat">Meat</option>
                </select>
            </label>

            {['name', 'amount_per', 'energy', 'fat', 'saturates', 'carbohydrate', 'sugars', 'fibre', 'protein', 'salt', 'image'].map((field) => (
                <label key={field} className="block">
                    <span className="text-gray-700 capitalize">{field.replace('_', ' ')}</span>
                    <input
                        type="text"
                        name={field}
                        value={foodData[field] || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-2 border rounded-md"
                    />
                </label>
            ))}

            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Submit</button>
        </form>
    );
}
