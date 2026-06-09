import {
    registerDevice,
    getDeviceUuid
} from './device.js';

import { loginAdmin, logoutAdmin } from './auth.js';

import { showAdminMenu } from './pages/admin-menu.js';

import {
    showAttendancePage,
    cleanupAttendancePage
}
    from './pages/attendance-page.js';
import { getAuth, onAuthStateChanged }
    from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import { app, db } from './firebase.js';
import {
    doc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import { showTeachersPage }
    from './pages/teachers-page.js';

import { showEventsPage }
    from './pages/events-page.js';

import { showDevicesPage }
    from './pages/devices-page.js';

import { showDashboardPage, cleanupDashboardPage }
    from './pages/dashboard-page.js';

import { showReportPage }
    from './pages/report-page.js';

import { showTutorialPage }
    from './pages/tutorial-page.js';

import { listenForAppUpdates } from './settings.js';
import { APP_CONFIG } from './config.js';

const versionEl = document.getElementById('appVersionText');
if (versionEl) {
    versionEl.innerText = `v${APP_CONFIG.version}`;
}

listenForAppUpdates(APP_CONFIG.version);

const content =
    document.getElementById('content');

const modal =
    document.getElementById('loginModal');

const closeModal =
    document.getElementById('closeModal');

const loginBtn =
    document.getElementById('loginBtn');

const logo =
    document.getElementById('appLogo');

const auth = getAuth(app);

let authListenerUnsubscribe = null;
let currentApprovedState = null;

async function init() {

    await registerDevice();

    const uuid = getDeviceUuid();
    const deviceRef = doc(db, 'devices', uuid);

    onSnapshot(deviceRef, async (docSnap) => {

        const approved =
            docSnap.exists() &&
            docSnap.data().approved;

        if (currentApprovedState === approved) {
            return;
        }

        currentApprovedState = approved;

        if (!approved) {

            cleanupAttendancePage();
            cleanupDashboardPage();

            if (authListenerUnsubscribe) {
                authListenerUnsubscribe();
                authListenerUnsubscribe = null;
            }

            content.innerHTML = `
                <div class="bg-white p-6 rounded-xl shadow">

                    <h2 class="text-xl font-bold mb-3">
                        Perangkat Belum Diverifikasi
                    </h2>

                    <p class="mb-3 text-gray-600">
                        Hubungi administrator untuk
                        melakukan verifikasi perangkat.
                    </p>

                    <div class="bg-slate-100 p-3 rounded text-sm break-all">
                        ${uuid}
                    </div>

                </div>
            `;

        } else {

            if (!authListenerUnsubscribe) {

                // console.log("[App] Registering onAuthStateChanged");
                authListenerUnsubscribe = onAuthStateChanged(
                    auth,
                    async user => {

                        // console.log("[App] onAuthStateChanged fired. User:", user ? user.email : "null");
                        if (user) {

                            await restorePage();

                        } else {

                            await showAttendancePage(
                                content
                            );

                        }

                    }
                );

            }

        }

    });

}

init();

let clickCount = 0;
let clickTimer = null;

logo.addEventListener('click', () => {

    clickCount++;

    clearTimeout(clickTimer);

    clickTimer = setTimeout(() => {
        clickCount = 0;
    }, 2000);

    if (clickCount >= 5) {

        clickCount = 0;

        if (auth.currentUser) {
            Swal.fire({
                title: 'Anda sudah login',
                text: 'Ingin logout dari mode Admin?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Ya, Logout',
                cancelButtonText: 'Batal'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('activePage');
                    await logoutAdmin();
                    location.reload();
                }
            });
        } else {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

    }

});

closeModal.addEventListener('click', () => {

    modal.classList.remove('flex');
    modal.classList.add('hidden');

});

loginBtn.addEventListener(
    'click',
    async () => {

        const email =
            document.getElementById('email').value;

        const password =
            document.getElementById('password').value;

        // console.log("[App] Login button clicked. Setting activePage to admin");
        // Set activePage sebelum login agar terdeteksi oleh onAuthStateChanged
        localStorage.setItem(
            'activePage',
            'admin'
        );

        // console.log("[App] Calling loginAdmin");
        const result =
            await loginAdmin(
                email,
                password
            );

        // console.log("[App] loginAdmin result:", result);
        if (!result.success) {

            localStorage.removeItem(
                'activePage'
            );

            Swal.fire('Pemberitahuan', result.message, 'info');

            return;
        }

        modal.classList.remove('flex');
        modal.classList.add('hidden');

        // console.log("[App] Login successful. Restoring page layout.");
        await restorePage();

    }
);

async function restorePage() {

    const page =
        localStorage.getItem(
            'activePage'
        );

    // console.log("[App] restorePage called. activePage in localStorage:", page);
    switch (page) {

        case 'teachers':
            await showTeachersPage(
                content
            );
            break;

        case 'events':
            await showEventsPage(
                content
            );
            break;

        case 'devices':
            await showDevicesPage(
                content
            );
            break;

        case 'dashboard':
            await showDashboardPage(
                content
            );
            break;

        case 'report':
            await showReportPage(
                content
            );
            break;

        case 'tutorial':
            await showTutorialPage(
                content
            );
            break;

        case 'admin':
            await showAdminMenu(
                content
            );
            break;

        default:
            await showAttendancePage(
                content
            );
            break;

    }

}