import { db, auth } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { collection, addDoc, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';


const stationSelect = document.getElementById("station");
const dateSelect = document.getElementById("slotDate");
const slotTimeSelect = document.getElementById("slotTime");
const bookingForm = document.getElementById("bookingForm");

// Load unique stations from Firebase

async function loadStations() {
    const snapshot = await getDocs(collection(db, "rechargeSlots"));
    const stations = new Set();

    snapshot.forEach(doc => {
        stations.add(doc.data().station);
    });

    stationSelect.innerHTML = `<option value="">Select Station</option>`;
    stations.forEach(station => {
        stationSelect.innerHTML += `<option value="${station}">${station}</option>`;
    });
}

//  Load dates when station selected

stationSelect.addEventListener("change", async () => {
    const selectedStation = stationSelect.value;
    const q = query(collection(db, "rechargeSlots"), where("station", "==", selectedStation));
    const snapshot = await getDocs(q);

    const dates = new Set();
    snapshot.forEach(doc => {
        dates.add(doc.data().slotDate);
    });

    dateSelect.innerHTML = `<option value="">Select Date</option>`;
    dates.forEach(date => {
        dateSelect.innerHTML += `<option value="${date}">${date}</option>`;
    });

    slotTimeSelect.innerHTML = `<option value="">Select Time Slot</option>`;
});

//  Load time slots when date selected
dateSelect.addEventListener("change", async () => {
    const selectedStation = stationSelect.value;
    const selectedDate = dateSelect.value;

    const q = query(
        collection(db, "rechargeSlots"),
        where("station", "==", selectedStation),
        where("slotDate", "==", selectedDate)
    );

    const snapshot = await getDocs(q);
    slotTimeSelect.innerHTML = `<option value="">Select Time Slot</option>`;

    snapshot.forEach(doc => {
        const { generatedSlots } = doc.data();
        if (Array.isArray(generatedSlots)) {
        generatedSlots.forEach(slot => {
            const slotText = `${slot.start} - ${slot.end}`;
            slotTimeSelect.innerHTML += `<option value="${slotText}">${slotText}</option>`;
        });
        }
    });
});

//  Handle Booking Submission

bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const vehicleNumber = document.getElementById("vehicleNumber").value;
    const station = stationSelect.value;
    const date = dateSelect.value;
    const slotTime = slotTimeSelect.value;

    onAuthStateChanged(auth, async (user) => {
        if (user) {
        try {
            await addDoc(collection(db, "bookings"), {
                userId: user.uid,
                name,
                vehicleNumber,
                station,
                date,
                slotTime,
                status: "Pending"
            });

            alert("Booking successful")
            bookingForm.reset();
        } catch (error) {
            alert("error"+ error.message);

        }
        } else {
            alert("Please login to book a slot")
        }
    });
});

// Call on load

loadStations();
