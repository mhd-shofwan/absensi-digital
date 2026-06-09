import { showDevicesPage } from './devices-page.js';
import { showTeachersPage } from './teachers-page.js';
import { showEventsPage } from './events-page.js';
import { showDashboardPage } from './dashboard-page.js';
import { showReportPage } from './report-page.js';
import { showTutorialPage } from './tutorial-page.js';
import { logoutAdmin } from '../auth.js';

export function showAdminMenu(content) {

    content.innerHTML = `

        <div
            class="
                max-w-6xl
                mx-auto
                space-y-6
            "
        >

            <!-- HERO -->

            <div
                class="
                    bg-gradient-to-r
                    from-slate-800
                    to-slate-900

                    text-white

                    rounded-3xl

                    p-6

                    shadow-lg
                "
            >

                <div
                    class="
                        text-slate-300
                        text-sm
                    "
                >
                    Administrator
                </div>

                <h1
                    class="
                        text-3xl
                        font-bold
                        mt-1
                    "
                >
                    Panel Admin
                </h1>

                <p
                    class="
                        mt-2
                        text-slate-300
                    "
                >
                    Kelola guru, event, perangkat,
                    dan pantau kehadiran realtime.
                </p>

            </div>

            <!-- MENU -->

            <div
                class="
                    grid
                    grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-6
                    gap-4
                "
            >

                <button
                    id="btnTutorial"
                    class="
                        bg-yellow-50

                        rounded-3xl

                        p-5

                        shadow-sm

                        hover:shadow-md
                        hover:-translate-y-1

                        transition-all

                        text-left
                        border
                        border-yellow-200
                    "
                >

                    <div class="text-4xl">
                        💡
                    </div>

                    <div
                        class="
                            mt-4
                            font-bold
                            text-lg
                            text-yellow-800
                        "
                    >
                        Cara Penggunaan
                    </div>

                    <div
                        class="
                            text-sm
                            text-yellow-600
                            mt-1
                        "
                    >
                        Tutorial aplikasi
                    </div>

                </button>

                <button
                    id="btnTeachers"
                    class="
                        bg-white

                        rounded-3xl

                        p-5

                        shadow-sm

                        hover:shadow-md
                        hover:-translate-y-1

                        transition-all

                        text-left
                    "
                >

                    <div class="text-4xl">
                        👨‍🏫
                    </div>

                    <div
                        class="
                            mt-4
                            font-bold
                            text-lg
                        "
                    >
                        Guru
                    </div>

                    <div
                        class="
                            text-sm
                            text-slate-500
                            mt-1
                        "
                    >
                        Kelola data guru
                    </div>

                </button>

                <button
                    id="btnEvents"
                    class="
                        bg-white

                        rounded-3xl

                        p-5

                        shadow-sm

                        hover:shadow-md
                        hover:-translate-y-1

                        transition-all

                        text-left
                    "
                >

                    <div class="text-4xl">
                        📖
                    </div>

                    <div
                        class="
                            mt-4
                            font-bold
                            text-lg
                        "
                    >
                        Event
                    </div>

                    <div
                        class="
                            text-sm
                            text-slate-500
                            mt-1
                        "
                    >
                        Kelola event
                    </div>

                </button>

                <button
                    id="btnDevices"
                    class="
                        bg-white

                        rounded-3xl

                        p-5

                        shadow-sm

                        hover:shadow-md
                        hover:-translate-y-1

                        transition-all

                        text-left
                    "
                >

                    <div class="text-4xl">
                        📱
                    </div>

                    <div
                        class="
                            mt-4
                            font-bold
                            text-lg
                        "
                    >
                        Perangkat
                    </div>

                    <div
                        class="
                            text-sm
                            text-slate-500
                            mt-1
                        "
                    >
                        Verifikasi perangkat
                    </div>

                </button>

                <button
                    id="btnDashboard"
                    class="
                        bg-white

                        rounded-3xl

                        p-5

                        shadow-sm

                        hover:shadow-md
                        hover:-translate-y-1

                        transition-all

                        text-left
                    "
                >

                    <div class="text-4xl">
                        📊
                    </div>

                    <div
                        class="
                            mt-4
                            font-bold
                            text-lg
                        "
                    >
                        Dashboard
                    </div>

                    <div
                        class="
                            text-sm
                            text-slate-500
                            mt-1
                        "
                    >
                        Statistik realtime
                    </div>

                </button>

                <button
                    id="btnReport"
                    class="
                        bg-white

                        rounded-3xl

                        p-5

                        shadow-sm

                        hover:shadow-md
                        hover:-translate-y-1

                        transition-all

                        text-left
                    "
                >

                    <div class="text-4xl">
                        📄
                    </div>

                    <div
                        class="
                            mt-4
                            font-bold
                            text-lg
                        "
                    >
                        Laporan
                    </div>

                    <div
                        class="
                            text-sm
                            text-slate-500
                            mt-1
                        "
                    >
                        Unduh absensi
                    </div>

                </button>

                <button
                    id="btnUndian"
                    class="
                        bg-white

                        rounded-3xl

                        p-5

                        shadow-sm

                        hover:shadow-md
                        hover:-translate-y-1

                        transition-all

                        text-left
                        relative
                    "
                >
                    <span class="absolute top-4 right-4 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Soon</span>
                    <div class="text-4xl">
                        🎡
                    </div>

                    <div
                        class="
                            mt-4
                            font-bold
                            text-lg
                        "
                    >
                        Undian
                    </div>

                    <div
                        class="
                            text-sm
                            text-slate-500
                            mt-1
                        "
                    >
                        Undian peserta
                    </div>

                </button>

            </div>

            <!-- QUICK ACTION -->

            <div
                class="
                    bg-white

                    rounded-3xl

                    p-6

                    shadow-sm
                "
            >

                <div
                    class="
                        flex
                        items-center
                        justify-between
                        gap-4
                    "
                >

                    <div>

                        <div
                            class="
                                font-bold
                                text-lg
                            "
                        >
                            Keluar dari Admin
                        </div>

                        <div
                            class="
                                text-sm
                                text-slate-500
                                mt-1
                            "
                        >
                            Kembali ke halaman absensi
                        </div>

                    </div>

                    <button
                        id="btnLogout"
                        class="
                            h-12

                            px-6

                            rounded-2xl

                            bg-red-600

                            text-white

                            font-semibold

                            hover:bg-red-700

                            transition
                        "
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>

    `;

    document
        .getElementById('btnTutorial')
        .addEventListener('click', () => {
            localStorage.setItem('activePage', 'tutorial');
            showTutorialPage(content);
        });

    document
        .getElementById('btnTeachers')
        .addEventListener('click', () => {
            localStorage.setItem('activePage', 'teachers');
            showTeachersPage(content);
        });

    document
        .getElementById('btnEvents')
        .addEventListener('click', () => {
            localStorage.setItem('activePage', 'events');
            showEventsPage(content);
        });

    document
        .getElementById('btnDevices')
        .addEventListener('click', () => {
            localStorage.setItem('activePage', 'devices');
            showDevicesPage(content);
        });

    document
        .getElementById('btnDashboard')
        .addEventListener('click', () => {
            localStorage.setItem('activePage', 'dashboard');
            showDashboardPage(content);
        });

    document
        .getElementById('btnReport')
        .addEventListener('click', () => {
            localStorage.setItem('activePage', 'report');
            showReportPage(content);
        });

    document
        .getElementById('btnUndian')
        .addEventListener('click', () => {
            Swal.fire('Coming Soon!', 'Fitur Undian Peserta (Wheel of Names) sedang dalam tahap pengembangan.', 'info');
        });

    document
        .getElementById('btnLogout')
        .addEventListener(
            'click',
            async () => {

                if (
                    !confirm(
                        'Keluar dari panel admin?'
                    )
                ) {
                    return;
                }

                localStorage.removeItem(
                    'activePage'
                );

                await logoutAdmin();

                location.reload();

            }
        );

}