import { db } from './firebase.js';
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Helper to compare semver (e.g., '1.0.1' vs '1.0.0')
function isNewerVersion(local, server) {
    if (!server) return false;
    const lParts = local.split('.').map(Number);
    const sParts = server.split('.').map(Number);
    
    for (let i = 0; i < 3; i++) {
        const l = lParts[i] || 0;
        const s = sParts[i] || 0;
        if (s > l) return true;
        if (s < l) return false;
    }
    return false;
}

export function listenForAppUpdates(localVersion) {
    const docRef = doc(db, 'settings', 'app');
    
    onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.data();
            const serverVersion = data.version;
            
            if (isNewerVersion(localVersion, serverVersion)) {
                Swal.fire({
                    title: 'Info Pembaruan!',
                    text: `Silahkan perbarui aplikasi ke versi terbaru (${serverVersion}). Sampai aplikasi diperbarui, aplikasi tidak bisa digunakan.`,
                    icon: 'warning',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false
                });
            }
        }
    }, (error) => {
        console.error("Error listening to app settings:", error);
    });
}
