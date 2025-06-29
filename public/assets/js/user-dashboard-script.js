import { auth } from './firebase.js';
import { onAuthStateChanged,signOut} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

// Detect currently logged-in user

onAuthStateChanged(auth, (user) => {
    if (user) {
        // If user is logged in, show their email
        document.getElementById("showUserEmail").textContent = user.email;
    } else {
        window.location.href = "../login.html";
    }
});



// // Logout with confirmation modal
const confirmModal = document.getElementById("confirmModal");
const modalCloseBtn = confirmModal.querySelector(".modal-close");
const btnCancel = confirmModal.querySelector(".btn-cancel");
const btnConfirm = confirmModal.querySelector(".btn-confirm");
const logoutBtn = document.getElementById("logoutBtn");


logoutBtn.addEventListener("click", () => {
    confirmModal.style.display = "block";
});

modalCloseBtn.addEventListener("click", () => {
    confirmModal.style.display = "none";
});

btnCancel.addEventListener("click", () => {
    confirmModal.style.display = "none";
});

btnConfirm.addEventListener("click", () => {
    confirmModal.style.display = "none";
    window.location.reload();
});

btnConfirm.addEventListener("click", async () => {
    confirmModal.style.display = "none";
    try {
        await signOut(auth);
        window.location.href = "../login.html";
    } catch (error) {
        alert("Error during logout: " + error.message);
    }
});






// Navigation functionality
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
}

// Add click events to navigation items
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const section = item.getAttribute('data-section');
        showSection(section);
    });
});

// Update time slots based on station and date selection
document.getElementById('station').addEventListener('change', updateTimeSlots);
document.getElementById('slotDate').addEventListener('change', updateTimeSlots);

function updateTimeSlots() {
    const station = document.getElementById('station').value;
    const date = document.getElementById('slotDate').value;
    const timeSlotSelect = document.getElementById('slotTime');
    
    if (station && date) {
        timeSlotSelect.innerHTML = `
            <option value="">Select Time Slot</option>
            <option value="09:00">9:00 AM - 10:00 AM</option>
            <option value="10:00">10:00 AM - 11:00 AM</option>
            <option value="11:00">11:00 AM - 12:00 PM</option>
            <option value="14:00">2:00 PM - 3:00 PM</option>
            <option value="15:00">3:00 PM - 4:00 PM</option>
            <option value="16:00">4:00 PM - 5:00 PM</option>
            <option value="17:00">5:00 PM - 6:00 PM</option>
        `;
        timeSlotSelect.disabled = false;
    } else {
        timeSlotSelect.innerHTML = '<option value="">Please select station and date first</option>';
        timeSlotSelect.disabled = true;
    }
}

// Search functionality
function searchStations() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.toLowerCase();
    
    if (query.trim() === '') {
        alert('Please enter a search term');
        return;
    }
    
    // Show loading message
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '<div class="loading"><div class="spinner"></div>Searching stations...</div>';
    
    // Simulate search delay
    setTimeout(() => {
        resultsContainer.innerHTML = `
            <div class="result-card">
                <h3 class="result-title">Downtown EV Hub</h3>
                <div class="result-details">
                    <div class="result-detail"><span>📍</span><span>123 Main Street, Downtown Area</span></div>
                    <div class="result-detail"><span>⚡</span><span>Fast Charging (50kW)</span></div>
                    <div class="result-detail"><span>🕒</span><span>24/7 Available</span></div>
                </div>
                <div class="result-footer">
                    <span class="status-badge status-available">4 slots available</span>
                    <span class="price">₹15/kWh</span>
                </div>
                <button class="btn btn-primary btn-full"><span>📅</span> Book Now</button>
            </div>
        `;
    }, 1000);
}



// Set today's date as default for date inputs
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('dateCheck');
    if (dateInput) {
        dateInput.value = today;
    }
    
    // Initialize time slots as disabled
    updateTimeSlots();
});

// Add enter key support for search
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchStations();
    }
});
