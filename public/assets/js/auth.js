import { auth,db } from './firebase.js';
// import { auth,db } from '../js/firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import{doc,setDoc ,getDoc} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";



// login



document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Get user role from Firestore
                const userDocRef = doc(db,"users", user.uid);
                const userDocSnap = await getDoc(userDocRef)

                if (userDocSnap.exists()) {
                    const role = userDocSnap.data().role;

                    if (role === "admin") {
                        alert("Admin login successfull")
                        window.location.href =  "./admin/admin.html";

                    } else if (role === "user") {
                        alert("user login successfull")
                        window.location.href = "user-dashboard.html";
                    } else {
                        alert("unknown")
                        await auth.signOut();
                    }
                }else{
                    alert("user data not found")
                    await auth.signOut();
                }

            }catch (error) {
                let message;
                    switch (error.code) {
                        case "auth/invalid-login-credentials":
                        case "auth/wrong-password":
                        case "auth/user-not-found":
                            message = " Invalid email or password";
                            break;
                        case "auth/invalid-email":
                            message = "Please enter a valid email address";
                            break;
                        default:
                            message =error.message;
                    }
                    alert( "❌ " + message)
            }
        });
    };



    // Register form

    const registerForm=document.getElementById("registerForm");
    if(registerForm){
        
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("regEmail").value;
            const password = document.getElementById("regPassword").value;
            const mobile = document.getElementById("mobile").value;
            const role = document.getElementById("role").value;
          

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await setDoc(doc(db, "users", user.uid), {
                    name,
                    email,
                    mobile,
                    role
                });

                alert("Registraion succesfull")

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1000);

            } catch (error) {
                alert(error.message)
            }
        });


    }
});