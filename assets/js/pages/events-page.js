import {
    getEvents,
    addEvent,
    updateEvent,
    openEvent,
    closeEvent,
    deleteEvent
}
from '../events.js';

import {
    showAdminMenu
}
from './admin-menu.js';

let eventData = [];
let editEventId = null;

export async function showEventsPage(content) {

    content.innerHTML = `

        <div
            class="
                max-w-6xl
                mx-auto
                space-y-5
            "
        >

            <button
                id="backAdmin"
                class="
                    h-11
                    px-5
                    bg-white
                    rounded-2xl
                    shadow-sm
                    border-2
                    border-orange-500
                    text-orange-600
                    font-bold
                "
            >
                ← Kembali
            </button>

            <!-- HERO -->

            <div
                class="
                    bg-gradient-to-r
                    from-amber-500
                    to-orange-500

                    text-white

                    rounded-3xl

                    p-6

                    shadow-lg
                "
            >

                <div class="text-amber-100">
                    Manajemen Kajian
                </div>

                <h2
                    class="
                        text-3xl
                        font-bold
                        mt-1
                    "
                >
                    Event Kajian
                </h2>

                <div
                    class="
                        mt-2
                        text-amber-100
                    "
                >
                    Kelola event dan buka absensi
                </div>

            </div>

            <!-- FORM -->

            <div
                class="
                    bg-white
                    rounded-3xl
                    p-6
                    shadow-sm
                    mt-5
                "
            >

                    <div
                        class="
                            font-bold
                            text-lg
                            mb-4
                        "
                    >
                        Form Event
                    </div>

                    <div class="grid md:grid-cols-2 gap-4">

                        <input
                            id="eventTitle"
                            type="text"
                            placeholder="Nama Kajian"
                            class="
                                w-full
                                h-12
                                px-4
                                rounded-2xl
                                border
                                border-slate-200
                            "
                        >

                        <input
                            id="eventDate"
                            type="date"
                            class="
                                w-full
                                h-12
                                px-4
                                rounded-2xl
                                border
                                border-slate-200
                            "
                        >

                    </div>

                    <button
                        id="saveEvent"
                        class="
                            mt-4
                            w-auto
                            px-8
                            h-12
                            bg-green-600
                            text-white
                            rounded-2xl
                            font-semibold
                        "
                    >
                            Simpan Event
                </button>

            </div>

            <!-- BATCH ACTIONS -->
            <div class="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm mt-8 mb-4">
                <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" id="selectAllEvents" class="w-5 h-5 rounded text-blue-600 border-slate-300">
                    <span class="font-medium text-slate-700">Pilih Semua</span>
                </label>
                <button
                    id="btnDeleteMultipleEvents"
                    class="
                        hidden
                        h-10
                        px-4
                        bg-red-600
                        text-white
                        rounded-xl
                        text-sm
                        font-semibold
                    "
                >
                    Hapus Terpilih
                </button>
            </div>

            <!-- LIST -->

            <div
                id="eventList"
                class="
                    grid
                    grid-cols-1
                    lg:grid-cols-2
                    gap-4
                "
            ></div>

        </div>

    `;

    document
        .getElementById('backAdmin')
        .addEventListener(
            'click',
            () => {
                localStorage.setItem('activePage', 'admin');
                showAdminMenu(content);
            }
        );

    eventData =
        await getEvents();

    renderEventList(content);

    document
        .getElementById('saveEvent')
        .addEventListener(
            'click',
            async () => {

                const title =
                    document
                        .getElementById('eventTitle')
                        .value
                        .trim();

                const date =
                    document
                        .getElementById('eventDate')
                        .value;

                if (!title || !date) {

                    Swal.fire('Error', 'Lengkapi data event', 'error');

                    return;
                }

                const button =
                    document.getElementById(
                        'saveEvent'
                    );

                button.disabled = true;

                if (editEventId) {

                    await updateEvent(
                        editEventId,
                        {
                            title,
                            date
                        }
                    );

                    editEventId = null;

                } else {

                    await addEvent({
                        title,
                        date
                    });

                }

                await showEventsPage(
                    content
                );

            }
        );

    document.getElementById('selectAllEvents').addEventListener('change', (e) => {
        const checked = e.target.checked;
        document.querySelectorAll('.event-checkbox').forEach(cb => {
            cb.checked = checked;
        });
        toggleDeleteEventsButton();
    });

    document.getElementById('btnDeleteMultipleEvents').addEventListener('click', async () => {
        const checkboxes = document.querySelectorAll('.event-checkbox:checked');
        const ids = Array.from(checkboxes).map(cb => cb.value);

        if (ids.length === 0) return;

        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Anda akan menghapus ${ids.length} event beserta seluruh data absensinya.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        });
        
        if (!result.isConfirmed) return;

        Swal.fire({
            title: 'Menghapus...',
            text: 'Mohon tunggu',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        for (const id of ids) {
            await deleteEvent(id);
        }

        Swal.close();

        await showEventsPage(content);
    });

}

function toggleDeleteEventsButton() {
    const checkedBoxes = document.querySelectorAll('.event-checkbox:checked');
    const btn = document.getElementById('btnDeleteMultipleEvents');
    if (checkedBoxes.length > 0) {
        btn.classList.remove('hidden');
    } else {
        btn.classList.add('hidden');
    }
}

function renderEventList(content) {

    const eventList =
        document.getElementById(
            'eventList'
        );

    document.getElementById('selectAllEvents').checked = false;
    toggleDeleteEventsButton();

    if (!eventData.length) {

        eventList.innerHTML = `

            <div
                class="
                    bg-white

                    rounded-3xl

                    p-8

                    text-center

                    shadow-sm
                "
            >

                <div class="text-5xl mb-3">
                    📖
                </div>

                Belum ada event

            </div>

        `;

        return;
    }

    eventList.innerHTML =
        eventData.map(event => `

            <div
                class="
                    bg-white

                    rounded-3xl

                    p-5

                    shadow-sm
                "
            >

                <div
                    class="
                        flex
                        justify-between
                        items-start
                        gap-3
                    "
                >

                    <div class="flex items-start gap-3">
                        <input type="checkbox" class="event-checkbox w-5 h-5 mt-1 rounded text-blue-600 border-slate-300" value="${event.id}">
                        <div>

                            <div
                                class="
                                    text-lg
                                    font-bold
                                "
                            >
                                ${event.title}
                            </div>

                            <div
                                class="
                                    text-sm
                                    text-slate-500
                                    mt-1
                                "
                            >
                                ${event.date}
                            </div>

                        </div>
                    </div>

                    <span
                        class="
                            px-3
                            py-1

                            rounded-full

                            text-xs

                            font-semibold

                            ${
                                event.status === 'open'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-slate-100 text-slate-600'
                            }
                        "
                    >
                        ${
                            event.status === 'open'
                            ? 'AKTIF'
                            : 'TUTUP'
                        }
                    </span>

                </div>

                <div
                    class="
                        grid
                        sm:grid-cols-3
                        gap-2

                        mt-5
                    "
                >

                    <button
                        class="
                            edit-btn

                            h-11

                            bg-blue-600

                            text-white

                            rounded-2xl
                        "
                        data-id="${event.id}"
                    >
                        Edit
                    </button>

                    ${event.status === 'open' ? `
                    <button
                        class="
                            toggle-btn
                            h-11
                            bg-slate-600
                            text-white
                            rounded-2xl
                        "
                        data-id="${event.id}"
                        data-action="close"
                    >
                        Nonaktifkan
                    </button>
                    ` : `
                    <button
                        class="
                            toggle-btn
                            h-11
                            bg-green-600
                            text-white
                            rounded-2xl
                        "
                        data-id="${event.id}"
                        data-action="open"
                    >
                        Aktifkan
                    </button>
                    `}

                    <button
                        class="
                            delete-btn

                            h-11

                            bg-red-600

                            text-white

                            rounded-2xl
                        "
                        data-id="${event.id}"
                        title="Hapus Event"
                    >
                        Hapus
                    </button>

                </div>

            </div>

        `).join('');

    bindEventActions(content);

}

function bindEventActions(content) {

    document.querySelectorAll('.event-checkbox').forEach(cb => {
        cb.addEventListener('change', () => {
            const allChecked = document.querySelectorAll('.event-checkbox:not(:checked)').length === 0;
            document.getElementById('selectAllEvents').checked = allChecked;
            toggleDeleteEventsButton();
        });
    });

    document
        .querySelectorAll('.edit-btn')
        .forEach(button => {

            button.addEventListener(
                'click',
                () => {

                    const event =
                        eventData.find(
                            item =>
                                item.id ===
                                button.dataset.id
                        );

                    editEventId =
                        event.id;

                    document
                        .getElementById(
                            'eventTitle'
                        )
                        .value =
                        event.title;

                    document
                        .getElementById(
                            'eventDate'
                        )
                        .value =
                        event.date;

                    document
                        .getElementById(
                            'saveEvent'
                        )
                        .textContent =
                        'Update Event';

                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });

                }
            );

        });

    document.querySelectorAll('.toggle-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const action = button.dataset.action;
            const actionText = action === 'open' ? 'mengaktifkan' : 'menonaktifkan';
            
            const result = await Swal.fire({
                title: 'Konfirmasi',
                text: `Apakah Anda yakin ingin ${actionText} event ini?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya, Lanjutkan',
                cancelButtonText: 'Batal'
            });

            if (!result.isConfirmed) return;

            button.disabled = true;

            if (action === 'open') {
                await openEvent(button.dataset.id);
            } else {
                await closeEvent(button.dataset.id);
            }

            await showEventsPage(content);
        });
    });

    document
        .querySelectorAll('.delete-btn')
        .forEach(button => {

            button.addEventListener(
                'click',
                async () => {

                    const result = await Swal.fire({
                        title: 'Apakah Anda yakin?',
                        text: 'Semua data absensi terkait event ini juga akan ikut terhapus.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: 'Ya, hapus!',
                        cancelButtonText: 'Batal'
                    });
                    
                    if (!result.isConfirmed) return;

                    button.disabled = true;

                    await deleteEvent(
                        button.dataset.id
                    );

                    await showEventsPage(
                        content
                    );

                }
            );

        });

}