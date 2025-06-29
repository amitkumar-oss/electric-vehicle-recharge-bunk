import { db, auth } from './firebase.js';
import {collection, query, where, getDocs, deleteDoc, doc} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';




const bookingsContainer = document.getElementById("bookingsContainer");

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            bookingsContainer.innerHTML = "<p>No bookings found.</p>";
            return;
        }

        bookingsContainer.innerHTML = "";

        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            const div = document.createElement("div");

            div.innerHTML = `
                <p><strong>Id No.:</strong> ${data.userId}</p>
                <p><strong>Vehicle Number:</strong> ${data.vehicleNumber}</p>
                <p><strong>Station:</strong> ${data.station}</p>
                <p><strong>Date:</strong> ${data.date}</p>
                <p><strong>Time:</strong> ${data.slotTime}</p>
                <p><strong>Status:</strong> ${data.status}</p>
                <button onclick="cancelBooking('${docSnap.id}')">Cancel</button> <br> <br>
                <hr> <br>

            `;

            bookingsContainer.appendChild(div);
        });
        
    } else {
        bookingsContainer.innerHTML = "<p>Please login to see your bookings.</p>";
    }
});

window.cancelBooking = async (id) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
        await deleteDoc(doc(db, "bookings", id));
        alert("Booking cancelled.");
        location.reload(); 
    }
};
