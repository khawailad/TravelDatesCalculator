document.getElementById('addTripButton').addEventListener('click', addTrip);
document.getElementById('calculateButton').addEventListener('click', calculatePresenceDays);

let tripCount = 0;
let totalPresenceDays = 0; // Track total presence days separately

function addTrip() {
    tripCount++;
    
    // Get the container where new trip inputs will be added
    const tripsList = document.getElementById('tripsList');

    // Create a new trip input section
    const newTrip = document.createElement('div');
    newTrip.classList.add('trip');
    newTrip.id = `trip${tripCount}`;

    newTrip.innerHTML = `
        <h4>Trip ${tripCount}</h4>
        <label for="startDate${tripCount}">Start Date:</label>
        <input type="date" id="startDate${tripCount}" required><br>
        <label for="endDate${tripCount}">End Date:</label>
        <input type="date" id="endDate${tripCount}" required><br><br>
        <label for="countriesVisited${tripCount}">Countries Visited:</label>
        <input type="text" id="countriesVisited${tripCount}" placeholder="Enter countries visited"><br><br>
    `;

    tripsList.appendChild(newTrip);
}

function calculatePresenceDays() {
    const moveInDateInput = document.getElementById('moveInDate').value;
    if (!moveInDateInput) {
        alert('Please enter a Move-in Date.');
        return;
    }

    const moveInDate = new Date(moveInDateInput);
    let currentPresenceDays = Math.floor((new Date() - moveInDate) / (1000 * 60 * 60 * 24)); // Initial Presence Days

    const trips = [];

    // Collect trip data
    for (let i = 1; i <= tripCount; i++) {
        const startDateInput = document.getElementById(`startDate${i}`).value;
        const endDateInput = document.getElementById(`endDate${i}`).value;
        const countriesVisitedInput = document.getElementById(`countriesVisited${i}`).value;

        if (startDateInput && endDateInput && countriesVisitedInput) {
            const startDate = new Date(startDateInput);
            const endDate = new Date(endDateInput);
            const tripDuration = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)); // Trip Duration in days

            trips.push({ startDate, endDate, countriesVisited: countriesVisitedInput, duration: tripDuration });
        }
    }

    // Process the trips and calculate presence days for each trip
    let tripRows = [];
    trips.forEach((trip) => {
        let tripPresenceDays = currentPresenceDays;

        if (trip.duration > 180) {
            // Reset Presence Days to 0 for trips longer than 180 days
            tripPresenceDays = 0;

            // Recalculate Presence Days from Return Date to Today
            const returnDate = trip.endDate;
            tripPresenceDays = Math.floor((new Date() - returnDate) / (1000 * 60 * 60 * 24)); // Recalculate from return date
        } else {
            // If trip is less than 180 days, subtract the trip duration from Presence Days
            tripPresenceDays -= trip.duration;
        }

        // Ensure that Presence Days doesn't go below 0
        if (tripPresenceDays < 0) {
            tripPresenceDays = 0;
        }

        // Update the row for the trip
        tripRows.push({
            startDate: adjustDateForDisplay(trip.startDate),
            endDate: adjustDateForDisplay(trip.endDate),
            countriesVisited: trip.countriesVisited,
            duration: trip.duration,
            presenceDays: tripPresenceDays
        });

        // Update the total presence days
        currentPresenceDays = tripPresenceDays;
    });

    // Update the table with the trip data
    updateTripTable(tripRows);
}

// Function to adjust the date by adding 1 day
function adjustDateForDisplay(date) {
    const adjustedDate = new Date(date);
    adjustedDate.setDate(adjustedDate.getDate() + 1); // Add 1 day
    return adjustedDate.toLocaleDateString();
}

// Function to dynamically update the table
function updateTripTable(tripRows) {
    const tripDataBody = document.getElementById('tripData');
    tripDataBody.innerHTML = ''; // Clear any previous rows

    tripRows.forEach((row) => {
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
            <td>${row.startDate}</td>
            <td>${row.endDate}</td>
            <td>${row.countriesVisited}</td>
            <td>${row.duration}</td>
            <td>${row.presenceDays}</td>
        `;
        tripDataBody.appendChild(tableRow);
    });
}
