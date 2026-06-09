import {
    getDevices,
    approveDevice,
    revokeDevice,
    updateDeviceName,
    deleteDevice
}
from '../devices.js';

import {
    getDeviceUuid
}
from '../device.js';

import {
    showAdminMenu
}
from './admin-menu.js';

export async function showDevicesPage(
    content
) {

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

            <div
                class="
                    bg-gradient-to-r
                    from-sky-600
                    to-cyan-600

                    text-white

                    rounded-3xl

                    p-6

                    shadow-lg
                "
            >

                <div class="text-sky-100">
                    Manajemen Perangkat
                </div>

                <h2
                    class="
                        text-3xl
                        font-bold
                        mt-1
                    "
                >
                    Device Manager
                </h2>

                <div
                    class="
                        mt-2
                        text-sky-100
                    "
                >
                    Kelola perangkat yang dapat
                    mengakses aplikasi absensi
                </div>

            </div>

            <div id="deviceStats"></div>

            <!-- BATCH ACTIONS -->
            <div class="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm mt-8 mb-4">
                <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" id="selectAllDevices" class="w-5 h-5 rounded text-blue-600 border-slate-300">
                    <span class="font-medium text-slate-700">Pilih Semua</span>
                </label>
                <button
                    id="btnDeleteMultipleDevices"
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

            <div
                id="deviceList"
                class="
                    grid
                    grid-cols-1
                    lg:grid-cols-2
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
                    Loading...
                </div>

            </div>

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

    document.getElementById('selectAllDevices').addEventListener('change', (e) => {
        const checked = e.target.checked;
        document.querySelectorAll('.device-checkbox').forEach(cb => {
            cb.checked = checked;
        });
        toggleDeleteDevicesButton();
    });

    document.getElementById('btnDeleteMultipleDevices').addEventListener('click', async () => {
        const checkboxes = document.querySelectorAll('.device-checkbox:checked');
        const ids = Array.from(checkboxes).map(cb => cb.value);

        if (ids.length === 0) return;

        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Anda akan menghapus ${ids.length} perangkat dari sistem.`,
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
            await deleteDevice(id);
        }

        Swal.close();

        await loadDevices(content);
    });

    await loadDevices(content);

}

function toggleDeleteDevicesButton() {
    const checkedBoxes = document.querySelectorAll('.device-checkbox:checked');
    const btn = document.getElementById('btnDeleteMultipleDevices');
    if (checkedBoxes.length > 0) {
        btn.classList.remove('hidden');
    } else {
        btn.classList.add('hidden');
    }
}

async function loadDevices(
    content
) {

    const devices =
        await getDevices();

    const deviceList =
        document.getElementById(
            'deviceList'
        );

    const deviceStats =
        document.getElementById(
            'deviceStats'
        );

    const totalDevices =
        devices.length;

    const approvedDevices =
        devices.filter(
            d => d.approved
        ).length;

    const pendingDevices =
        devices.filter(
            d => !d.approved
        ).length;

    deviceStats.innerHTML = `

        <div
            class="
                grid
                grid-cols-3
                gap-3
            "
        >

            <div
                class="
                    bg-white
                    border-4
                    border-blue-500
                    rounded-3xl
                    p-4
                    text-center
                    shadow-md
                "
            >

                <div
                    class="
                        text-xs
                        text-slate-500
                    "
                >
                    Total
                </div>

                <div
                    class="
                        text-3xl
                        font-bold
                        text-blue-600
                    "
                >
                    ${totalDevices}
                </div>

            </div>

            <div
                class="
                    bg-white
                    border-4
                    border-green-500
                    rounded-3xl
                    p-4
                    text-center
                    shadow-md
                "
            >

                <div
                    class="
                        text-xs
                        text-slate-500
                    "
                >
                    Aktif
                </div>

                <div
                    class="
                        text-3xl
                        font-bold
                        text-green-600
                    "
                >
                    ${approvedDevices}
                </div>

            </div>

            <div
                class="
                    bg-white
                    border-4
                    border-amber-500
                    rounded-3xl
                    p-4
                    text-center
                    shadow-md
                "
            >

                <div
                    class="
                        text-xs
                        text-slate-500
                    "
                >
                    Pending
                </div>

                <div
                    class="
                        text-3xl
                        font-bold
                        text-amber-600
                    "
                >
                    ${pendingDevices}
                </div>

            </div>

        </div>

    `;

    if (!devices.length) {

        deviceList.innerHTML = `

            <div
                class="
                    col-span-full

                    bg-white

                    rounded-3xl

                    p-10

                    text-center

                    shadow-sm
                "
            >

                <div
                    class="
                        text-6xl
                        mb-4
                    "
                >
                    📱
                </div>

                <div
                    class="
                        text-xl
                        font-bold
                    "
                >
                    Belum Ada Device
                </div>

            </div>

        `;

        document.getElementById('selectAllDevices').checked = false;
        toggleDeleteDevicesButton();

        return;

    }

    const currentUuid = getDeviceUuid();

    deviceList.innerHTML =
        devices

            .sort((a, b) => {

                // Current device always at top
                if (a.id === currentUuid) return -1;
                if (b.id === currentUuid) return 1;

                if (
                    a.approved ===
                    b.approved
                ) {
                    return 0;
                }

                return a.approved
                    ? 1
                    : -1;

            })

            .map(device => {
                
                const isCurrent = device.id === currentUuid;
                
                return `

                <div
                    class="
                        bg-white

                        rounded-3xl

                        p-5

                        shadow-sm
                        
                        ${isCurrent ? 'ring-2 ring-blue-500 bg-blue-50/30' : ''}
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

                        <div>
                            
                            <div class="flex items-center gap-3">
                                <input type="checkbox" class="device-checkbox w-5 h-5 rounded text-blue-600 border-slate-300" value="${device.id}">
                                <div
                                    class="
                                        text-lg
                                        font-bold
                                    "
                                >
                                    ${
                                        device.deviceName ||
                                        'Belum Diberi Nama'
                                    }
                                </div>
                                
                                ${isCurrent ? `
                                    <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200 uppercase tracking-wider shrink-0 whitespace-nowrap">
                                        Perangkat Ini
                                    </span>
                                ` : ''}
                            </div>

                            <div
                                class="
                                    text-sm
                                    text-slate-500
                                    mt-1
                                "
                            >
                                ${
                                    device.approved
                                    ? 'Perangkat Aktif'
                                    : 'Menunggu Verifikasi'
                                }
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
                                    device.approved
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-amber-100 text-amber-700'
                                }
                            "
                        >
                            ${
                                device.approved
                                ? 'AKTIF'
                                : 'PENDING'
                            }
                        </span>

                    </div>

                    <div
                        class="
                            mt-4

                            p-3

                            bg-slate-50

                            rounded-2xl

                            text-xs

                            font-mono

                            break-all
                        "
                    >
                        ${device.uuid}
                    </div>

                    <div
                        class="
                            flex
                            gap-2
                            mt-4
                        "
                    >

                        ${
                            !device.approved
                            ? `
                            <button
                                class="
                                    approve-btn

                                    flex-1

                                    h-11

                                    bg-green-600

                                    text-white

                                    rounded-2xl

                                    font-semibold
                                "
                                data-id="${device.id}"
                            >
                                Setujui
                            </button>
                            `
                            : `
                            <button
                                class="
                                    revoke-btn

                                    flex-1

                                    h-11

                                    bg-rose-600

                                    text-white

                                    rounded-2xl

                                    font-semibold
                                "
                                data-id="${device.id}"
                            >
                                Cabut Izin
                            </button>
                            `
                        }

                        <button
                            class="
                                rename-btn

                                flex-1

                                h-11

                                bg-blue-600

                                text-white

                                rounded-2xl

                                font-semibold
                            "
                            data-id="${device.id}"
                            data-name="${
                                device.deviceName || ''
                            }"
                        >
                            Rename
                        </button>

                        <button
                            class="
                                delete-btn

                                flex-none
                                w-14

                                h-11

                                bg-red-600

                                text-white

                                rounded-2xl

                                font-semibold
                            "
                            data-id="${device.id}"
                            title="Hapus Device"
                        >
                            <span class="text-xl">🗑</span>
                        </button>

                    </div>

                </div>

            `;
            })
            .join('');

    document.getElementById('selectAllDevices').checked = false;
    toggleDeleteDevicesButton();

    bindActions(content);

}

function bindActions(
    content
) {

    document.querySelectorAll('.device-checkbox').forEach(cb => {
        cb.addEventListener('change', () => {
            const allChecked = document.querySelectorAll('.device-checkbox:not(:checked)').length === 0;
            document.getElementById('selectAllDevices').checked = allChecked;
            toggleDeleteDevicesButton();
        });
    });

    document
        .querySelectorAll(
            '.approve-btn'
        )
        .forEach(button => {

            button.addEventListener(
                'click',
                async () => {
                    const result = await Swal.fire({
                        title: 'Setujui perangkat ini?',
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Ya, setujui',
                        cancelButtonText: 'Batal'
                    });
                    if (!result.isConfirmed) return;

                    const device =
                        deviceData.find(
                            d =>
                                d.id ===
                                button.dataset.id
                        );

                    const nameResult = await Swal.fire({
                        title: 'Nama Device:',
                        input: 'text',
                        inputValue: device.deviceName || 'Device Baru',
                        showCancelButton: true,
                        inputValidator: (value) => {
                            if (!value) return 'Nama tidak boleh kosong'
                        }
                    });
                    if (!nameResult.isConfirmed || !nameResult.value) return;
                    const name = nameResult.value;

                    button.disabled =
                        true;

                    await approveDevice(
                        button.dataset.id,
                        name
                    );

                    await loadDevices(
                        content
                    );

                }
            );

        });

    document
        .querySelectorAll(
            '.revoke-btn'
        )
        .forEach(button => {

            button.addEventListener(
                'click',
                async () => {
                    const result = await Swal.fire({
                        title: 'Cabut akses perangkat ini?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        confirmButtonText: 'Ya, cabut',
                        cancelButtonText: 'Batal'
                    });
                    if (!result.isConfirmed) return;

                    button.disabled =
                        true;

                    await revokeDevice(
                        button.dataset.id
                    );

                    await loadDevices(
                        content
                    );

                }
            );

        });

    document
        .querySelectorAll(
            '.rename-btn'
        )
        .forEach(button => {

            button.addEventListener(
                'click',
                async () => {

                    const device =
                        deviceData.find(
                            d =>
                                d.id ===
                                button.dataset.id
                        );

                    const result = await Swal.fire({
                        title: 'Ubah Nama Device:',
                        input: 'text',
                        inputValue: device.deviceName,
                        showCancelButton: true,
                        inputValidator: (value) => {
                            if (!value) return 'Nama tidak boleh kosong'
                        }
                    });
                    if (!result.isConfirmed || !result.value) return;
                    const newName = result.value;

                    button.disabled =
                        true;

                    await updateDeviceName(
                        button.dataset.id,
                        newName
                    );

                    await loadDevices(
                        content
                    );

                }
            );

        });

    document
        .querySelectorAll(
            '.delete-btn'
        )
        .forEach(button => {

            button.addEventListener(
                'click',
                async () => {

                    const result = await Swal.fire({
                        title: 'Apakah Anda yakin?',
                        text: 'Ingin menghapus perangkat ini dari sistem?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: 'Ya, hapus!',
                        cancelButtonText: 'Batal'
                    });
                    if (!result.isConfirmed) return;

                    button.disabled =
                        true;

                    await deleteDevice(
                        button.dataset.id
                    );

                    await loadDevices(
                        content
                    );

                }
            );

        });

}