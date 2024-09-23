// Stored meal values
const mealValues = {
    breakfast: null,
    lunch: null,
    dinner: null,
    supper: null
};

// Stored correction Values
const correctionValues = {
    breakfastI: null,
    lunchI: null,
    dinnerI: null,
    supperI: null
};

let targetBloodGlucose = null;
let carbDose = null;
let correctionDose = null;

window.onload = function() {
    // Load saved meal values
    ['breakfast', 'lunch', 'dinner', 'supper'].forEach(meal => {
        const savedValue = localStorage.getItem(`${meal}Value`);
        if (savedValue !== null) {
            mealValues[meal] = parseFloat(savedValue);
            if (document.getElementById(`${meal}Value`)) {
                document.getElementById(`${meal}Value`).value = savedValue;
            }
        }
    });

    // Load saved correction values
    ['breakfastI', 'lunchI', 'dinnerI', 'supperI'].forEach(correction => {
        const savedCorrectionValue = localStorage.getItem(`${correction}Value`);
        if (savedCorrectionValue !== null) {
            correctionValues[correction] = parseFloat(savedCorrectionValue);
        }
    });

    // Load target blood glucose
    const savedTargetBG = localStorage.getItem('targetBloodGlucose');
    if (savedTargetBG !== null) {
        targetBloodGlucose = parseFloat(savedTargetBG);
        if (document.getElementById('target')) {
            document.getElementById('target').value = targetBloodGlucose;
        }
    }
}

// Save meal values
function saveMealValues() {
    ['breakfast', 'lunch', 'dinner', 'supper'].forEach(meal => {
        const mealValue = parseFloat(document.getElementById(`${meal}Value`).value);

        if (mealValue >= 2 && mealValue <= 24) {
            mealValues[meal] = mealValue;
            // Save to localStorage
            localStorage.setItem(`${meal}Value`, mealValue);
        }
    });
}

// Save correction values
function saveCorrectionValues() {
    ['breakfastI', 'lunchI', 'dinnerI', 'supperI'].forEach(correction => {
        const correctionValue = parseFloat(document.getElementById(`${correction}Value`).value);

        if (correctionValue > 0) {
            correctionValues[correction] = correctionValue;
            // Save to localStorage
            localStorage.setItem(`${correction}Value`, correctionValue);
        }
    });
}

// Save target blood glucose value
function saveTargetValue() {
    targetBloodGlucose = parseFloat(document.getElementById('target').value);
    localStorage.setItem('targetBloodGlucose', targetBloodGlucose);
}

// Calculate Carb dose
function calculateCarbs() {
    const meal = document.getElementById('mealEating').value;
    const carbAmount = parseFloat(document.getElementById('carbAmount').value);
    const savedValue = mealValues[meal];

    if (savedValue === null) {
        document.getElementById('result').innerText = 'Error: Please save a value for the selected meal first!';
        return;
    }

    if (isNaN(carbAmount)) {
        document.getElementById('result').innerText = 'Error: Please enter a valid number!';
        return;
    }

    carbDose = carbAmount / savedValue;
    carbDose = Math.round(carbDose * 2) / 2;

    document.getElementById('result').innerText = carbDose;
    updateTotalInsulinDose();
}

// Calculate Correction dose
function calculateCorrection() {
    const currentBG = parseFloat(document.getElementById('current').value);
    const correction = document.getElementById('correction').value;
    const correctionFactor = correctionValues[correction];

    if (targetBloodGlucose === null) {
        document.getElementById('correctionResult').innerText = 'Error: Please save a target blood glucose value first!';
        return;
    }

    if (correctionFactor === null) {
        document.getElementById('correctionResult').innerText = 'Error: Please save a correction value for the selected meal first!';
        return;
    }

    if (isNaN(currentBG)) {
        document.getElementById('correctionResult').innerText = 'Error: Please enter a valid current blood glucose level!';
        return;
    }

    // Calculate Correction Dose: (Current Blood - Target Blood) / Correction
    const bgDifference = currentBG - targetBloodGlucose;
    correctionDose = bgDifference / correctionFactor;
    correctionDose = Math.round(correctionDose * 2) / 2;

    document.getElementById('correctionResult').innerText = correctionDose;
    updateTotalInsulinDose();
}

// Function to update and display the total insulin dose
function updateTotalInsulinDose() {
    if (carbDose === null || correctionDose === null) {
        document.getElementById('totalInsulinDose').innerText = '';
        return;
    }

    // Calculate total insulin dose
    const totalInsulinDose = carbDose + correctionDose;
    document.getElementById('totalInsulinDose').innerText = totalInsulinDose;
}
