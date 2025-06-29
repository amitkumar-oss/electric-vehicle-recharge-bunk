import { db } from './firebase.js';
import { collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';



// Fill Station Dropdown on Page Load

async function loadStations() {
    const stationSelect = document.getElementById("station");
    stationSelect.innerHTML = "<option value=''>Loading...</option>";

    try {
        const stationSnap = await getDocs(collection(db, "stations")); 
        if (stationSnap.empty) {
            stationSelect.innerHTML = "<option value=''>No stations found</option>";
            return;
        }

        stationSelect.innerHTML = "<option value=''>Select a Station</option>";
        stationSnap.forEach(doc => {
            const station = doc.data();
            const option = document.createElement("option");
            option.value = station.name;
            option.textContent = station.name;
            stationSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Error loading stations:", error);
        stationSelect.innerHTML = "<option value=''>Error loading stations</option>";
    }
}

window.addEventListener("DOMContentLoaded", loadStations);




document.getElementById("checkForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const station = document.getElementById("station").value.trim();
    const date = document.getElementById("date").value;
    const result = document.getElementById("result");
    result.innerHTML = "<p>Loading...</p>";

     try {
        const slotSnap = await getDocs(query(
            collection(db, "rechargeSlots"),
            where("station", "==", station),
            where("slotDate", "==", date)
        ));

        if (slotSnap.empty) {
            result.innerHTML = "<p>No slots found for this station and date.</p>";
            return;
        }

        const slotData = slotSnap.docs[0].data();
        const generatedSlots = slotData.generatedSlots || [];

        // Get all bookings for the station and date
        const allBookingsSnap = await getDocs(query(
            collection(db, "bookings"),
            where("station", "==", station),
            where("date", "==", date)
        ));

        const bookings = allBookingsSnap.docs.map(doc => doc.data());

        result.innerHTML = `<h3>Slot Vacancy for ${station} on ${date}</h3>`;

        const ul = document.createElement("ul");

        generatedSlots.forEach((time) => {
            // Compare time.start with booking.slotTime
            const count = bookings.filter(b => b.slotTime === time.start).length;

            const li = document.createElement("li");
            li.textContent = `${time.start} to ${time.end} → ${count} booking(s)`;
            ul.appendChild(li);
        });

        result.appendChild(ul);
        
    } catch (err) {
        result.innerHTML = `<p>Error: ${err.message}</p>`;
        console.log(err.message)
    }
});
     

