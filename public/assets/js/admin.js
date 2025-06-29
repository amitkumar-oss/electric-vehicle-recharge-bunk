import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';



onAuthStateChanged(auth, async (user) => {

    if (user) {
        const emailSpan = document.getElementById("admin-email");
        if (emailSpan) {
            emailSpan.textContent = user.email;
        }
    } else {
        window.location.href = "../login.html";
    }
});


//  view all users

document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("view-users").addEventListener("click", async () => {
        const output = document.getElementById("output");
        output.innerHTML = "<h2>All Users : <br><br></h2>";

        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.role === "user") {
                    output.innerHTML += `
                            <div>
                                <p><strong>User Name:</strong> ${data.name}</p>
                                <p><strong>User Email:</strong> ${data.email}</p>
                                <p><strong>User mobile:</strong> ${data.mobile}</p> <br>
                                <hr> <br>
                            </div>
                        `;

                }
            });


        } catch (error) {
            output.innerHTML = `<p>Error loading users: ${error.message}</p>`;
        }
    });



    // // view booking

    document.getElementById("view-bookings").addEventListener("click", async () => {
        const output = document.getElementById("booking-output");
        output.innerHTML = "<h2>All Bookings :</h2> <br>";

        try {
            const querySnapshot = await getDocs(collection(db, "bookings"));
            const uniqueKeys = new Set();
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const key = `${data.userId}-${data.station}-${data.date}-${data.slotTime}-${data.vehicleNumber}`;

                if (!uniqueKeys.has(key)) {
                    uniqueKeys.add(key);

                    output.innerHTML += `
                        <div>
                            <p><strong>User Name :</strong>${data.name}</p>
                            <p><strong>User ID :</strong> ${data.userId}</p>
                            <p><strong>Station Name :</strong> ${data.station}</p>
                            <p><strong>Vehicle Number :</strong> ${data.vehicleNumber}</p>
                            <p><strong>Date :</strong> ${data.date}</p>
                            <p><strong>Time Slot :</strong> ${data.slotTime}</p>
                            <p><strong>Status :</strong> ${data.status}</p>

                            <label for="status-${doc.id}"><strong>Update Status:</strong></label>
                            <select class="status-select" id="status-${doc.id}" data-id="${doc.id}">
                                <option value="Pending" ${data.status === "Pending" ? "selected" : ""}>Pending</option>
                                <option value="Approved" ${data.status === "Approved" ? "selected" : ""}>Approved</option>
                                <option value="Rejected" ${data.status === "Rejected" ? "selected" : ""}>Rejected</option>
                                <option value="Completed" ${data.status === "Completed" ? "selected" : ""}>Completed</option>
                            </select>
                            <button class="update-status-btn" data-id="${doc.id}">Update</button><br>
                            <hr> 
                        </div>
                    `;
                }


            });

            attachStatusUpdateListeners();


        } catch (error) {
            output.innerHTML = `<p>Error loading bookings: ${error.message}</p>`;
        }
    });


    function attachStatusUpdateListeners() {
        const buttons = document.querySelectorAll(".update-status-btn");

        buttons.forEach((btn) => {

            btn.addEventListener("click", async () => {
                const docId = btn.getAttribute("data-id");
                const newStatus = document.querySelector(`#status-${docId}`).value;
                const bookingRef = doc(db, "bookings", docId);

                try {
                    await updateDoc(bookingRef, { status: newStatus });
                    alert("Status updated successfully!");

                    document.getElementById("view-bookings").dispatchEvent(new Event("click"));

                } catch (err) {
                    alert("Error updating status: " + err.message);
                }
            });
        });
    }



    //  add bunks


    // document.getElementById("bunkForm").addEventListener("submit", async (e) => {
    //     e.preventDefault();
    //     console.log("Form found:", form);

    //     if (!form) {
    //         alert("❌ bunkForm not found in DOM!");
    //         return;
    //     }

    //     form.addEventListener("submit", (e) => {
    //         e.preventDefault();
    //         console.log("✅ Form submitted");
    //     });

    //     const name = document.getElementById("stationName").value;
    //     const city = document.getElementById("city").value;
    //     const mobile = document.getElementById("mobile").value;
    //     const mapLink = document.getElementById("stationMapLink").value;

    //     try {
    //         await addDoc(collection(db, "stations"), {
    //             name,
    //             city,
    //             mobile,
    //             mapLink
    //         });
    //         alert("Bunk location added successfully!")
    //         console.log(name, city, mobile, mapLink)

    //         // clear the form
    //         document.getElementById("bunkForm").reset();

    //     } catch (error) {
    //         alert("Error: " + error.message)

    //     }
    // });


    document.addEventListener("DOMContentLoaded", () => {
        console.log("✅ DOM fully loaded");

        const form = document.getElementById("bunkForm");
        console.log("Form found:", form);

        if (!form) {
            alert("❌ bunkForm not found in DOM!");
            return;
        }

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            console.log("✅ Form submitted");

            const name = document.getElementById("stationName").value;
            const city = document.getElementById("city").value;
            const mobile = document.getElementById("mobile").value;
            const mapLink = document.getElementById("stationMapLink").value;

            try {
                await addDoc(collection(db, "stations"), {
                    name,
                    city,
                    mobile,
                    mapLink
                });
                alert("Bunk location added successfully!");
                console.log(name, city, mobile, mapLink);

                form.reset();
            } catch (error) {
                alert("Error: " + error.message);
            }
        });
    });


    // manage bunks    

    document.getElementById("loadBunksBtn").addEventListener("click", async () => {
        const bunkList = document.getElementById("bunkList");
        bunkList.innerHTML = "<h3>All Bunk Locations :<br><br></h3>";

        try {
            const snapshot = await getDocs(collection(db, "stations"));
            snapshot.forEach((bunkDoc) => {
                const bunk = bunkDoc.data();
                const bunkId = bunkDoc.id;

                const bunkCard = document.createElement("div");


                bunkCard.innerHTML = `
                        <p><strong>Name:</strong> <input type="text" value="${bunk.name}" id="name-${bunkId}" /></p>
                        <p><strong>City:</strong> <input type="text" value="${bunk.city}" id="city-${bunkId}" /></p>
                        <p><strong>Mobile:</strong> <input type="text" value="${bunk.mobile}" id="mobile-${bunkId}" /></p>
                        <p><strong>Map Link:</strong> <input type="text" value="${bunk.mapLink}" id="map-${bunkId}" /></p><br>
                        <button onclick="updateBunk('${bunkId}')">Update</button>
                        <button onclick="deleteBunk('${bunkId}')">Delete</button><br>
                        <hr>
                    `;

                bunkList.appendChild(bunkCard);
            });
        } catch (err) {
            bunkList.innerHTML = `<p>Error: ${err.message}</p>`;
        }
    });

    window.updateBunk = async function (bunkId) {
        const name = document.getElementById(`name-${bunkId}`).value;
        const city = document.getElementById(`city-${bunkId}`).value;
        const mobile = document.getElementById(`mobile-${bunkId}`).value;
        const mapLink = document.getElementById(`map-${bunkId}`).value;

        try {
            const bunkRef = doc(db, "stations", bunkId);
            await updateDoc(bunkRef, {
                name,
                city,
                mobile,
                mapLink
            });
            alert("✅ Bunk updated!");
        } catch (error) {
            alert("❌ Error: " + error.message);
        }
    };

    // deleteBunk

    window.deleteBunk = async function (bunkId) {
        if (confirm("Are you sure you want to delete this bunk?")) {
            try {
                await deleteDoc(doc(db, "stations", bunkId));
                alert("Bunk deleted!");
                document.getElementById("loadBunksBtn").click();

            } catch (error) {
                alert("Error: " + error.message);
            }
        }
    };



    // manage recharge slot

    const slotForm = document.getElementById("slotForm");
    const slotsOutput = document.getElementById("slotsOutput");

    // Add Slot
    slotForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const station = document.getElementById("station").value;
        const slotDate = document.getElementById("slotDate").value;
        const startTime = document.getElementById("startTime").value;
        const endTime = document.getElementById("endTime").value;
        const slotDuration = parseInt(document.getElementById("slotDuration").value);
        const status = document.getElementById("status").value;

        const slots = generateTimeSlots(startTime, endTime, slotDuration);

        try {

            await addDoc(collection(db, "rechargeSlots"), {
                station,
                slotDate,
                startTime,
                endTime,
                slotDuration,
                status,
                generatedSlots: slots
            });


            alert(`Successfully added time slot for station: ${station}`);
            slotForm.reset();
            loadSlots();
        } catch (error) {
            alert("Error adding slot: " + error.message);
        }
    });


    // Generate Slots Between Start and End Time


    function generateTimeSlots(start, end, duration) {

        const slots = [];
        let [startHour, startMinute] = start.split(":").map(Number);
        let [endHour, endMinute] = end.split(":").map(Number);

        let startDate = new Date(0, 0, 0, startHour, startMinute);
        let endDate = new Date(0, 0, 0, endHour, endMinute);

        while (startDate < endDate) {
            let slotStart = startDate.toTimeString().slice(0, 5);

            startDate.setMinutes(startDate.getMinutes() + duration);
            if (startDate > endDate) break;

            let slotEnd = startDate.toTimeString().slice(0, 5);

            slots.push({ start: slotStart, end: slotEnd });
        }

        return slots;
    }

    // Load All Slots
    async function loadSlots() {
        slotsOutput.innerHTML = "";
        const querySnapshot = await getDocs(collection(db, "rechargeSlots"));

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const div = document.createElement("div");

            const slotList = data.generatedSlots?.map(
                s => `<li>${s.start} to ${s.end}</li>`
            ).join("") || "<li>No slots generated</li>";

            div.innerHTML = `
                    <p><strong>Station:</strong> ${data.station}</p>
                    <p><strong>Date:</strong> ${data.slotDate}</p>
                    <p><strong>Time Range:</strong> ${data.startTime} to ${data.endTime}</p>
                    <p><strong>Slot Duration:</strong> ${data.slotDuration} minutes</p>
                    <p><strong>Status:</strong> ${data.status}</p>
                    <p><strong>Generated Slots:</strong></p>
                    <ul>${slotList}</ul>
                    <button onclick="deleteSlot('${docSnap.id}')">Delete</button><br>
                    <hr>
                `;

            slotsOutput.appendChild(div);
        });
    }

    // Delete Slot
    window.deleteSlot = async (id) => {
        try {
            await deleteDoc(doc(db, "rechargeSlots", id));
            alert("Slot deleted");
            loadSlots();

        } catch (err) {
            alert("Error deleting slot: " + err.message);
        }
    };

    loadSlots();



    // -----------------------------------------------


    // Elements
    const sections = document.querySelectorAll(".content-section");
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
    const loadingOverlay = document.getElementById("loadingOverlay");
    const confirmModal = document.getElementById("confirmModal");
    const modalCloseBtn = confirmModal.querySelector(".modal-close");
    const btnCancel = confirmModal.querySelector(".btn-cancel");
    const btnConfirm = confirmModal.querySelector(".btn-confirm");
    const logoutBtn = document.getElementById("logoutBtn");



    // Utility Functions

    function showSection(sectionId) {
        sections.forEach((section) => {
            if (section.id === sectionId) {
                section.classList.add("active");
            } else {
                section.classList.remove("active");
            }
        });
        navLinks.forEach((link) => {
            if (link.dataset.section + "-section" === sectionId) {
                link.parentElement.classList.add("active");
            } else {
                link.parentElement.classList.remove("active");
            }
        });
    }

    function showLoading(show) {
        loadingOverlay.style.display = show ? "flex" : "none";
    }



    // Update dashboard stats

    async function fetchUsers() {
        const snapshot = await getDocs(collection(db, "users"));
        const users = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.role === "user") {
                users.push({ id: doc.id, ...data });
            }
        });
        return users;
    }

    async function fetchBookings() {
        const snapshot = await getDocs(collection(db, "bookings"));
        const bookings = [];
        snapshot.forEach(doc => {
            bookings.push({ id: doc.id, ...doc.data() });
        });
        return bookings;
    }

    async function fetchBunks() {
        const snapshot = await getDocs(collection(db, "bunks"));
        const bunks = [];
        snapshot.forEach(doc => {
            bunks.push({ id: doc.id, ...doc.data() });
        });
        return bunks;
    }

    async function fetchSlots() {
        const snapshot = await getDocs(collection(db, "slots"));
        const slots = [];
        snapshot.forEach(doc => {
            slots.push({ id: doc.id, ...doc.data() });
        });
        return slots;
    }

    // --------Find and Set Stat --------
    function setStatCount(labelText, count) {
        const card = [...document.querySelectorAll(".stat-card")]
            .find(card => card.querySelector("h3")?.textContent.includes(labelText));
        const numberEl = card?.querySelector(".stat-number");
        if (numberEl) numberEl.textContent = count;
    }

    // -------- Dashboard Updater --------
    async function updateDashboardStats() {
        const users = await fetchUsers();
        setStatCount("Total Users", users.length);

        const bookings = await fetchBookings();
        setStatCount("Active Bookings", bookings.length);

        const bunks = await fetchBunks();
        setStatCount("EV Bunks", bunks.length);

        const slots = await fetchSlots();
        const availableCount = slots.filter(slot => slot.status === "Available").length;
        setStatCount("Available Slots", availableCount);
    }


    // Navigation click event
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const section = link.dataset.section + "-section";
            showSection(section);

            // Trigger respective button click to load data for that section
            switch (link.dataset.section) {
                case "users":
                    // Fire the view-users button click handler to load users data
                    // document.getElementById("view-users").click();
                    break;
                case "bookings":
                    // Fire the view-bookings button click handler to load booking data
                    // document.getElementById("view-bookings").click();
                    break;
                case "bunks":
                    // Fire the loadBunksBtn click handler to load bunks data
                    // document.getElementById("loadBunksBtn").click();
                    break;
                case "slots":
                    // If you want to load slots on nav click, just call loadSlots function directly
                    if (typeof loadSlots === 'function') {
                        loadSlots();
                    }
                    break;
                case "dashboard":
                    // Optionally update dashboard stats when clicking dashboard nav
                    updateDashboardStats();
                    break;
                default:
                    break;
            }
        });
    });


    // const loadBunksBtn = document.getElementById("loadBunksBtn");
    // if (loadBunksBtn) {
    //     loadBunksBtn.addEventListener("click", async () => {
    //         // Bunks fetching logic runs on click, just show section here
    //         showSection("bunks-section");
    //     });
    // }





    // // Logout with confirmation modal
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
        alert("You have been logged out.");

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

    // Initialize dashboard
    showSection("dashboard-section");
    updateDashboardStats();
});



// for hamburger icon

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");


let overlay = document.createElement("div");
overlay.className = "sidebar-overlay";
document.body.appendChild(overlay);

menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    overlay.style.display = sidebar.classList.contains("open") ? "block" : "none";
});

overlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.style.display = "none";
});

const navLinks = document.querySelectorAll(".sidebar .nav-link");

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove("open");
            overlay.style.display = "none";
        }
    });
});
