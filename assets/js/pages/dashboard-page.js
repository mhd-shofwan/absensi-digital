import {
    showAdminMenu
}
from './admin-menu.js';

import {
    subscribeDashboard
}
from '../dashboard.js';

import {
    setAdminAttendance
}
from '../attendance.js';

import { escapeHtml } from '../utils.js';

let unsubscribeDashboard = null;

export async function showDashboardPage(
    content
) {

    unsubscribeDashboard?.();

    unsubscribeDashboard =
        subscribeDashboard(
            data => {

                renderDashboard(
                    content,
                    data
                );

            }
        );

}

function renderDashboard(
    content,
    data
) {

    if (!data) {

        content.innerHTML = `

            <div
                class="
                    max-w-5xl
                    mx-auto
                    space-y-4
                "
            >

                <button
                    id="backAdmin"
                    class="
                        h-11
                        px-5
                        rounded-2xl
                        bg-white
                        shadow-sm
                    "
                >
                    ← Kembali
                </button>

                <div
                    class="
                        bg-white
                        rounded-3xl
                        p-10
                        text-center
                        shadow-sm
                    "
                >

                    <div class="text-6xl mb-4">
                        📖
                    </div>

                    <h2
                        class="
                            text-2xl
                            font-bold
                        "
                    >
                        Belum Ada Kajian Aktif
                    </h2>

                    <p
                        class="
                            mt-3
                            text-slate-500
                        "
                    >
                        Silakan buka event kajian terlebih dahulu
                    </p>

                </div>

            </div>

        `;

        bindBackButton(content);

        return;

    }

    const percentage =
        data.totalTeachers
            ? Math.round(
                data.hadirCount /
                data.totalTeachers *
                100
            )
            : 0;

    content.innerHTML = `

        <div
            class="
                max-w-6xl
                mx-auto
                space-y-5
            "
        >

            <!-- TOP -->

            <div
                class="
                    flex
                    items-center
                    justify-between
                    gap-3
                    flex-wrap
                "
            >

                <button
                    id="backAdmin"
                    class="
                        h-11
                        px-5

                        rounded-2xl

                        bg-white

                        shadow-sm

                        hover:shadow-md
                    "
                >
                    ← Kembali
                </button>

            </div>

            <!-- HERO -->

            <div
                class="
                    bg-gradient-to-r
                    from-purple-600
                    to-indigo-600

                    text-white

                    rounded-3xl

                    p-6

                    shadow-lg
                "
            >

                <div
                    class="
                        text-purple-100
                        text-sm
                    "
                >
                    Dashboard Kehadiran
                </div>

                <h2
                    class="
                        text-3xl
                        font-bold
                        mt-1
                    "
                >
                    ${escapeHtml(data.eventTitle)}
                </h2>

                <div
                    class="
                        mt-6
                    "
                >

                    <div
                        class="
                            flex
                            justify-between
                            text-sm
                            mb-2
                        "
                    >

                        <span>
                            Progress Kehadiran
                        </span>

                        <span>
                            ${data.percentage}%
                        </span>

                    </div>

                    <div
                        class="
                            h-4
                            bg-white/20
                            rounded-full
                            overflow-hidden
                        "
                    >

                        <div
                            class="
                                h-full
                                bg-white
                                rounded-full
                            "
                            style="
                                width:${data.percentage}%;
                            "
                        ></div>

                    </div>

                </div>

            </div>

            <!-- MAIN STATS -->

            <div
                class="
                    grid
                    grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-5
                    gap-4
                "
            >

                <div
                    class="
                        bg-white
                        border-4
                        border-blue-500
                        rounded-2xl
                        shadow-md
                        p-5
                        text-center
                    "
                >

                    <div
                        class="
                            text-sm
                            text-slate-500
                        "
                    >
                        Total Guru
                    </div>

                    <div
                        class="
                            mt-2
                            text-3xl
                            font-bold
                            text-blue-600
                        "
                    >
                        ${data.totalTeachers}
                    </div>

                </div>

                <div
                    class="
                        bg-white
                        border-4
                        border-green-500
                        rounded-2xl
                        shadow-md
                        p-5
                        text-center
                    "
                >

                    <div
                        class="
                            text-sm
                            text-slate-500
                        "
                    >
                        Hadir
                    </div>

                    <div
                        class="
                            mt-2
                            text-3xl
                            font-bold
                            text-green-600
                        "
                    >
                        ${data.hadirCount}
                    </div>

                </div>

                <div
                    class="
                        bg-white
                        border-4
                        border-amber-500
                        rounded-2xl
                        shadow-md
                        p-5
                        text-center
                    "
                >

                    <div
                        class="
                            text-sm
                            text-slate-500
                        "
                    >
                        Sakit
                    </div>

                    <div
                        class="
                            mt-2
                            text-3xl
                            font-bold
                            text-amber-600
                        "
                    >
                        ${data.sakitCount}
                    </div>

                </div>

                <div
                    class="
                        bg-white
                        border-4
                        border-purple-500
                        rounded-2xl
                        shadow-md
                        p-5
                        text-center
                    "
                >

                    <div
                        class="
                            text-sm
                            text-slate-500
                        "
                    >
                        Izin
                    </div>

                    <div
                        class="
                            mt-2
                            text-3xl
                            font-bold
                            text-purple-600
                        "
                    >
                        ${data.izinCount}
                    </div>

                </div>

                <div
                    class="
                        bg-white
                        border-l-4
                        border-red-500
                        rounded-2xl
                        shadow-md
                        p-5
                        text-center
                    "
                >

                    <div
                        class="
                            text-sm
                            text-slate-500
                        "
                    >
                        Alpha
                    </div>

                    <div
                        class="
                            mt-2
                            text-3xl
                            font-bold
                            text-red-600
                        "
                    >
                        ${data.alfaCount}
                    </div>

                </div>

            </div>

            <!-- GENDER STATS -->

            <div
                class="
                    grid
                    md:grid-cols-2
                    gap-4
                "
            >

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
                            gap-3
                        "
                    >

                        <div class="text-3xl">
                            👳
                        </div>

                        <div>

                            <div
                                class="
                                    font-bold
                                    text-lg
                                "
                            >
                                Ikhwan
                            </div>

                            <div
                                class="
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Kehadiran Ikhwan
                            </div>

                        </div>

                    </div>

                    <div
                        class="
                            mt-6
                            text-5xl
                            font-bold
                            text-blue-600
                        "
                    >
                        ${data.ikhwanPresent}
                    </div>

                    <div
                        class="
                            mt-2
                            text-slate-500
                        "
                    >
                        dari
                        ${data.ikhwanTotal}
                        guru
                    </div>

                </div>

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
                            gap-3
                        "
                    >

                        <div class="text-3xl">
                            🧕
                        </div>

                        <div>

                            <div
                                class="
                                    font-bold
                                    text-lg
                                "
                            >
                                Akhwat
                            </div>

                            <div
                                class="
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Kehadiran Akhwat
                            </div>

                        </div>

                    </div>

                    <div
                        class="
                            mt-6
                            text-5xl
                            font-bold
                            text-pink-600
                        "
                    >
                        ${data.akhwatPresent}
                    </div>

                    <div
                        class="
                            mt-2
                            text-slate-500
                        "
                    >
                        dari
                        ${data.akhwatTotal}
                        guru
                    </div>

                </div>

            </div>

            <!-- TEACHERS LIST -->

            <div class="grid md:grid-cols-2 gap-5 mt-8">

                <!-- IKHWAN LIST -->
                <div
                    class="
                        bg-white
                        border
                        border-slate-200
                        rounded-3xl
                        p-6
                        shadow-sm
                    "
                >
                    <div
                        class="
                            flex
                            items-center
                            gap-2
                            font-bold
                            text-lg
                            mb-4
                            text-blue-700
                        "
                    >
                        <span>👳</span>
                        <span>Kehadiran Ikhwan</span>
                    </div>
                    
                    <div class="grid gap-3">
                        ${data.teachersList.filter(t => t.gender === 'ikhwan').map(t => `
                            <div class="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                <div>
                                    <div class="font-semibold text-slate-800">${escapeHtml(t.name)}</div>
                                </div>
                                <select 
                                    class="status-select bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                    data-teacher-id="${t.id}"
                                    data-teacher-name="${escapeHtml(t.name)}"
                                    data-teacher-gender="${t.gender}"
                                >
                                    <option value="alpha" ${t.attendanceStatus === 'alpha' ? 'selected' : ''}>Alpha</option>
                                    <option value="hadir" ${t.attendanceStatus === 'hadir' ? 'selected' : ''}>Hadir</option>
                                    <option value="sakit" ${t.attendanceStatus === 'sakit' ? 'selected' : ''}>Sakit</option>
                                    <option value="izin" ${t.attendanceStatus === 'izin' ? 'selected' : ''}>Izin</option>
                                </select>
                            </div>
                        `).join('')}
                        ${data.teachersList.filter(t => t.gender === 'ikhwan').length === 0 ? '<div class="text-slate-500 text-sm text-center py-4">Tidak ada data</div>' : ''}
                    </div>

                </div>

                <!-- AKHWAT LIST -->
                <div
                    class="
                        bg-white
                        border
                        border-slate-200
                        rounded-3xl
                        p-6
                        shadow-sm
                    "
                >
                    <div
                        class="
                            flex
                            items-center
                            gap-2
                            font-bold
                            text-lg
                            mb-4
                            text-pink-700
                        "
                    >
                        <span>🧕</span>
                        <span>Kehadiran Akhwat</span>
                    </div>
                    
                    <div class="grid gap-3">
                        ${data.teachersList.filter(t => t.gender === 'akhwat').map(t => `
                            <div class="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                <div>
                                    <div class="font-semibold text-slate-800">${escapeHtml(t.name)}</div>
                                </div>
                                <select 
                                    class="status-select bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                    data-teacher-id="${t.id}"
                                    data-teacher-name="${escapeHtml(t.name)}"
                                    data-teacher-gender="${t.gender}"
                                >
                                    <option value="alpha" ${t.attendanceStatus === 'alpha' ? 'selected' : ''}>Alpha</option>
                                    <option value="hadir" ${t.attendanceStatus === 'hadir' ? 'selected' : ''}>Hadir</option>
                                    <option value="sakit" ${t.attendanceStatus === 'sakit' ? 'selected' : ''}>Sakit</option>
                                    <option value="izin" ${t.attendanceStatus === 'izin' ? 'selected' : ''}>Izin</option>
                                </select>
                            </div>
                        `).join('')}
                        ${data.teachersList.filter(t => t.gender === 'akhwat').length === 0 ? '<div class="text-slate-500 text-sm text-center py-4">Tidak ada data</div>' : ''}
                    </div>

                </div>

            </div>

        </div>

    `;

    bindBackButton(content);
    bindStatusSelects(data);

}

function bindStatusSelects(data) {
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            const status = e.target.value;
            const teacherId = e.target.dataset.teacherId;
            const teacherName = e.target.dataset.teacherName;
            const teacherGender = e.target.dataset.teacherGender;
            
            const event = {
                id: data.eventId,
                title: data.eventTitle
            };
            
            e.target.disabled = true;
            await setAdminAttendance(event, teacherId, teacherName, teacherGender, status);
            e.target.disabled = false;
        });
    });
}

function bindBackButton(
    content
) {

    const button =
        document.getElementById(
            'backAdmin'
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        'click',
        () => {

            unsubscribeDashboard?.();
            
            localStorage.setItem('activePage', 'admin');

            showAdminMenu(
                content
            );

        }
    );

}

export function cleanupDashboardPage() {

    unsubscribeDashboard?.();

    unsubscribeDashboard = null;

}