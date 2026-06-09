import { initializeAuth, browserLocalPersistence, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { app } from "./firebase.js";

const auth = initializeAuth(app, {
    persistence: browserLocalPersistence
});

export async function loginAdmin(email, password) {

    try {

        const credential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        return {
            success: true,
            user: credential.user
        };

    } catch (error) {

        return {
            success: false,
            message: error.message
        };

    }

}

export async function logoutAdmin() {

    await signOut(auth);

}