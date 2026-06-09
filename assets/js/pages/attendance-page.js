import {
    subscribeActiveEvent,
    subscribeTeachers,
    subscribeAttendances,
    saveAttendance
}
from '../attendance.js';

let currentMode =
    localStorage.getItem(
        'attendance_mode'
    ) || 'ikhwan';

let allTeachers = [];
let allAttendances = [];
let currentEvent = null;

let unsubscribeTeachers = null;
let unsubscribeAttendances = null;
let unsubscribeEvent = null;

export async function showAttendancePage(
    content
) {

    unsubscribeEvent?.();

    unsubscribeEvent = subscribeActiveEvent(event => {

        currentEvent = event;

        if (!event) {

            content.innerHTML = `

                <div class="
                    max-w-3xl
                    mx-auto
                ">

                    <div class="
                        bg-white
                        rounded-3xl
                        p-8
                        shadow-sm
                        text-center
                    ">

                        <div class="text-6xl mb-4">
                            📖
                        </div>

                        <h2 class="
                            text-2xl
                            font-bold
                        ">
                            Belum Ada Kajian Dibuka
                        </h2>

                        <p class="
                            mt-3
                            text-slate-500
                        ">
                            Silakan hubungi administrator
                        </p>

                    </div>

                </div>

            `;

            unsubscribeTeachers?.();
            unsubscribeAttendances?.();
            unsubscribeTeachers = null;
            unsubscribeAttendances = null;

            return;
        }

        renderActiveEventUI(content, event);
        startRealtime();

    });

}

function renderActiveEventUI(content, event) {
    content.innerHTML = `

        <div class="
            max-w-6xl
            mx-auto
            space-y-5
        ">

            <!-- HERO -->

            <div class="
                bg-gradient-to-r
                from-blue-600
                to-indigo-600

                text-white

                rounded-3xl

                p-6

                shadow-lg
            ">

                <div class="
                    text-blue-100
                    text-sm
                ">
                    Kajian Aktif
                </div>

                <h2 class="
                    text-2xl
                    md:text-3xl
                    font-bold
                    mt-1
                ">
                    ${event.title}
                </h2>

                <div class="
                    mt-2
                    text-blue-100
                ">
                    ${event.date}
                </div>

            </div>

            <!-- MODE -->

            <div class="
                bg-white
                rounded-2xl
                p-1
                flex
                shadow-sm
            ">

                <button
                    id="modeIkhwan"
                    class="
                        flex-1
                        h-12
                        rounded-xl
                        font-semibold
                        transition
                        ${
                            currentMode === 'ikhwan'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600'
                        }
                    "
                >
                    👳 IKHWAN
                </button>

                <button
                    id="modeAkhwat"
                    class="
                        flex-1
                        h-12
                        rounded-xl
                        font-semibold
                        transition
                        ${
                            currentMode === 'akhwat'
                            ? 'bg-pink-600 text-white'
                            : 'text-slate-600'
                        }
                    "
                >
                    🧕 AKHWAT
                </button>

            </div>



            <!-- SEARCH -->

            <div>

                <input
                    id="searchTeacher"
                    type="text"
                    placeholder="Cari nama guru..."
                    class="
                        w-full
                        h-12
                        px-4

                        rounded-2xl

                        border
                        border-slate-200

                        bg-white

                        shadow-sm

                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                    "
                >

            </div>

            <!-- LIST -->

            <div
                id="teacherList"
                class="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-3
                    gap-3
                "
            ></div>

        </div>

    `;

    bindModeButtons(content);

    document
        .getElementById('searchTeacher')
        .addEventListener(
            'input',
            renderTeachers
        );
}

function startRealtime() {

    unsubscribeTeachers?.();
    unsubscribeAttendances?.();

    unsubscribeTeachers =
        subscribeTeachers(
            teachers => {

                allTeachers =
                    teachers;

                renderTeachers();

            }
        );

    unsubscribeAttendances =
        subscribeAttendances(
            attendances => {

                allAttendances =
                    attendances;

                renderTeachers();

            }
        );

}

function renderTeachers() {

    const teacherList =
        document.getElementById(
            'teacherList'
        );

    if (
        !teacherList ||
        !currentEvent
    ) {
        return;
    }

    const keyword =
        document
            .getElementById(
                'searchTeacher'
            )
            .value
            .toLowerCase();

    const attendedTeacherIds =
        new Set(

            allAttendances

                .filter(item =>
                    item.eventId ===
                    currentEvent.id
                )

                .map(item =>
                    item.teacherId
                )

        );

    const teachers =
        allTeachers

            .filter(teacher =>

                teacher.active &&

                teacher.gender ===
                currentMode &&

                !attendedTeacherIds.has(
                    teacher.id
                )

            )

            .filter(teacher =>
                teacher.name
                    .toLowerCase()
                    .includes(keyword)
            );



    if (!teachers.length) {

        teacherList.innerHTML = `

            <div class="
                col-span-full

                bg-white

                rounded-3xl

                p-8

                text-center

                shadow-sm
            ">

                <div class="text-5xl mb-3">
                    ✅
                </div>

                <div class="font-semibold">
                    Semua telah Absensi
                </div>

            </div>

        `;

        return;
    }

    teacherList.innerHTML =
        teachers.map(teacher => `

            <button
                class="
                    attendance-btn

                    bg-white

                    rounded-3xl

                    p-5

                    shadow-sm

                    hover:shadow-md

                    hover:-translate-y-1

                    transition-all

                    text-left
                "

                data-id="${teacher.id}"
            >

                <div class="
                    flex
                    items-center
                    justify-between
                ">

                    <div>

                        <div class="
                            text-lg
                            font-bold
                            text-slate-800
                        ">
                            ${teacher.name}
                        </div>

                        <div class="
                            text-sm
                            text-slate-500
                            mt-1
                        ">
                            Tap untuk absensi
                        </div>

                    </div>

                    <div class="
                        text-2xl
                    ">
                        ➜
                    </div>

                </div>

            </button>

        `).join('');

    bindAttendanceButtons(
        teachers
    );

}

function bindModeButtons(content) {

    document
        .getElementById('modeIkhwan')
        .addEventListener(
            'click',
            async () => {

                currentMode =
                    'ikhwan';

                localStorage.setItem(
                    'attendance_mode',
                    currentMode
                );

                await showAttendancePage(
                    content
                );

            }
        );

    document
        .getElementById('modeAkhwat')
        .addEventListener(
            'click',
            async () => {

                currentMode =
                    'akhwat';

                localStorage.setItem(
                    'attendance_mode',
                    currentMode
                );

                await showAttendancePage(
                    content
                );

            }
        );

}

function bindAttendanceButtons(
    teachers
) {

    const modal =
        document.getElementById(
            'attendanceModal'
        );

    const teacherName =
        document.getElementById(
            'attendanceTeacherName'
        );

    const cancelBtn =
        document.getElementById(
            'cancelAttendance'
        );

    const confirmBtn =
        document.getElementById(
            'confirmAttendance'
        );

    document
        .querySelectorAll(
            '.attendance-btn'
        )
        .forEach(button => {

            button.addEventListener(
                'click',
                () => {

                    const teacher =
                        teachers.find(
                            item =>
                                item.id ===
                                button.dataset.id
                        );

                    teacherName.textContent =
                        teacher.name;

                    modal.classList.remove(
                        'hidden'
                    );

                    modal.classList.add(
                        'flex'
                    );

                    confirmBtn.onclick =
                        async () => {

                            confirmBtn.disabled =
                                true;

                            confirmBtn.textContent =
                                'Menyimpan...';

                            await saveAttendance(
                                teacher
                            );

                            modal.classList.remove(
                                'flex'
                            );

                            modal.classList.add(
                                'hidden'
                            );

                            confirmBtn.disabled =
                                false;

                            confirmBtn.textContent =
                                'Hadir';

                        };

                }
            );

        });

    cancelBtn.onclick = () => {

        modal.classList.remove(
            'flex'
        );

        modal.classList.add(
            'hidden'
        );

    };

}

export function cleanupAttendancePage() {

    unsubscribeEvent?.();

    unsubscribeEvent = null;

    unsubscribeTeachers?.();

    unsubscribeTeachers = null;

    unsubscribeAttendances?.();

    unsubscribeAttendances = null;

}