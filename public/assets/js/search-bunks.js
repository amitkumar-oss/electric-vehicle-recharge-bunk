import { db } from './firebase.js';
import {collection, query, where, getDocs} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';


const resultsDiv = document.getElementById("results");

window.searchStations = async () => {
    const keyword = document.getElementById("searchInput").value.trim().toLowerCase();
    resultsDiv.innerHTML = "Searching...";

    if (!keyword) {
        resultsDiv.innerHTML = "Please enter a search term.";
        return;
    }

    const stationsRef = collection(db, "stations");
    const snapshot = await getDocs(stationsRef);

    const results = [];

    snapshot.forEach(doc => {
        const data = doc.data();
        const name = data.name?.toLowerCase() || "";
        const city = data.city?.toLowerCase() || "";

        if (name.includes(keyword) || city.includes(keyword)) {
            results.push(data);
        }
    });

    if (results.length === 0) {
        resultsDiv.innerHTML = "No matching stations found.";
        return;
    }

    resultsDiv.innerHTML = results.map(station => `
        <div style="margin-bottom: 20px;">
            <p><strong>Station Name: ${station.name}</strong></p>
            <p>City: ${station.city}</p>
            <p>Mobile: ${station.mobile}</p>
            <a href="${station.mapLink}" target="_blank">📍 View on Google Maps</a>
        </div>
    `).join("");
};
