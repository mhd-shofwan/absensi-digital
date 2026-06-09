import {
    addTeacher,
    getTeachers,
    updateTeacher,
    toggleTeacherStatus,
    deleteTeacher
}
from '../teachers.js';

import {
    showAdminMenu
}
from './admin-menu.js';

let teacherData = [];
let editTeacherId = null;

export async function showTeachersPage(content) {

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
                    from-green-600
                    to-emerald-600

                    text-white

                    rounded-3xl

                    p-6

                    shadow-lg
                "
            >

                <div class="text-green-100">
                    Master Data
                </div>

                <h2
                    class="
                        text-3xl
                        font-bold
                        mt-1
                    "
                >
                    Data Guru
                </h2>

                <div
                    class="
                        mt-2
                        text-green-100
                    "
                >
                    Tambah, edit, dan kelola guru
                </div>

            </div>

            <!-- FORM -->

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
                        font-bold
                        text-lg
                        mb-4
                    "
                >
                    Form Guru
                </div>

                <div
                    class="
                        grid
                        md:grid-cols-2
                        gap-4
                    "
                >

                    <input
                        id="teacherName"
                        type="text"
                        placeholder="Nama Guru"
                        class="
                            h-12
                            px-4

                            border
                            border-slate-200

                            rounded-2xl
                        "
                    >

                    <select
                        id="teacherGender"
                        class="
                            h-12
                            px-4

                            border
                            border-slate-200

                            rounded-2xl
                        "
                    >

                        <option value="ikhwan">
                            Ikhwan
                        </option>

                        <option value="akhwat">
                            Akhwat
                        </option>

                    </select>

                </div>

                <button
                    id="saveTeacher"
                    class="
                        mt-4
                        h-12
                        px-6
                        bg-green-600
                        text-white
                        rounded-2xl
                        font-semibold
                    "
                >
                    Simpan Guru
                </button>

            </div>

            <!-- IMPORT EXCEL -->
            <div class="bg-indigo-50 rounded-3xl p-6 shadow-sm border border-indigo-100">
                <div class="font-bold text-lg text-indigo-900 mb-2">
                    📥 Import Data via Excel
                </div>
                <div class="text-indigo-700 text-sm mb-4">
                    Upload file .xlsx atau .csv untuk menambahkan banyak guru sekaligus. Pastikan file berisi kolom <b>Nama Guru</b> dan <b>Gender</b>.
                </div>
                <div class="flex flex-col sm:flex-row gap-4 items-center">
                    <a href="example.csv" download="example.csv" class="h-11 px-5 bg-white border-2 border-indigo-300 text-indigo-700 font-bold rounded-2xl flex items-center justify-center hover:bg-indigo-50 transition whitespace-nowrap">
                        Download Contoh CSV
                    </a>
                    <input type="file" id="excelFile" accept=".xlsx, .xls, .csv" class="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2.5 file:px-5
                        file:rounded-2xl file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-600 file:text-white
                        hover:file:bg-indigo-700
                        cursor-pointer
                    "/>
                </div>
            </div>

            <!-- SEARCH & FILTER -->

            <div class="flex flex-col md:flex-row gap-4 items-center">
                <input
                    id="searchTeacher"
                    type="text"
                    placeholder="Cari guru..."
                    class="
                        flex-1
                        w-full
                        min-h-[3rem]
                        px-4
                        bg-white
                        rounded-2xl
                        border
                        border-slate-200
                        shadow-sm
                    "
                >
                <select
                    id="filterGender"
                    class="
                        min-h-[3rem]
                        w-full md:w-auto
                        px-4
                        bg-white
                        rounded-2xl
                        border
                        border-slate-200
                        shadow-sm
                    "
                >
                    <option value="semua">Semua Gender</option>
                    <option value="ikhwan">Ikhwan</option>
                    <option value="akhwat">Akhwat</option>
                </select>
            </div>

            <!-- BATCH ACTIONS -->
            <div class="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm">
                <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" id="selectAllTeachers" class="w-5 h-5 rounded text-blue-600 border-slate-300">
                    <span class="font-medium text-slate-700">Pilih Semua</span>
                </label>
                <button
                    id="btnDeleteMultiple"
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
                id="teacherList"
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

    teacherData =
        await getTeachers();

    renderTeacherList();

    document
        .getElementById('saveTeacher')
        .addEventListener(
            'click',
            async () => {

                const name =
                    document
                        .getElementById('teacherName')
                        .value
                        .trim();

                const gender =
                    document
                        .getElementById('teacherGender')
                        .value;

                if (!name || !gender) {

                    Swal.fire('Error', 'Nama dan gender wajib diisi', 'error');

                    return;
                }

                const saveButton =
                    document.getElementById(
                        'saveTeacher'
                    );

                saveButton.disabled = true;

                if (editTeacherId) {

                    await updateTeacher(
                        editTeacherId,
                        {
                            name,
                            gender
                        }
                    );

                    editTeacherId = null;

                } else {

                    await addTeacher({
                        name,
                        gender
                    });

                }

                await showTeachersPage(
                    content
                );

            }
        );

    document.getElementById('excelFile').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, {type: 'array'});
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);

                if (json.length === 0) {
                    Swal.fire('Error', 'File Excel kosong atau tidak valid!', 'error');
                    return;
                }

                Swal.fire({
                    title: 'Memproses data...',
                    text: 'Mohon tunggu',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                let added = 0;
                for (const row of json) {
                    const keys = Object.keys(row);
                    const nameKey = keys.find(k => k.toLowerCase().includes('nama'));
                    const genderKey = keys.find(k => k.toLowerCase().includes('gender') || k.toLowerCase().includes('kelamin') || k.toLowerCase().includes('jenis'));
                    
                    if (nameKey && genderKey) {
                        const name = row[nameKey].toString().trim();
                        let gender = row[genderKey].toString().trim().toLowerCase();
                        if (gender !== 'ikhwan' && gender !== 'akhwat') {
                            gender = 'ikhwan'; // Default if invalid
                        }
                        if (name) {
                            await addTeacher({name, gender});
                            added++;
                        }
                    }
                }

                Swal.close();
                Swal.fire('Berhasil', `${added} guru berhasil diimpor!`, 'success');
                
                document.getElementById('excelFile').value = '';
                teacherData = await getTeachers();
                renderTeacherList();
            } catch (err) {
                console.error(err);
                Swal.fire('Error', 'Gagal memproses file Excel. Pastikan file valid.', 'error');
            }
        };
        reader.readAsArrayBuffer(file);
    });

    document.getElementById('searchTeacher').addEventListener('input', renderTeacherList);
    document.getElementById('filterGender').addEventListener('change', renderTeacherList);

    document.getElementById('selectAllTeachers').addEventListener('change', (e) => {
        const checked = e.target.checked;
        document.querySelectorAll('.teacher-checkbox').forEach(cb => {
            cb.checked = checked;
        });
        toggleDeleteButton();
    });

    document.getElementById('btnDeleteMultiple').addEventListener('click', async () => {
        const checkboxes = document.querySelectorAll('.teacher-checkbox:checked');
        const ids = Array.from(checkboxes).map(cb => cb.value);

        if (ids.length === 0) return;

        const result = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Anda akan menghapus ${ids.length} guru beserta seluruh data absensinya.`,
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
            await deleteTeacher(id);
        }

        Swal.close();

        teacherData = await getTeachers();
        renderTeacherList();
    });

}

function toggleDeleteButton() {
    const checkedBoxes = document.querySelectorAll('.teacher-checkbox:checked');
    const btn = document.getElementById('btnDeleteMultiple');
    if (checkedBoxes.length > 0) {
        btn.classList.remove('hidden');
    } else {
        btn.classList.add('hidden');
    }
}

function renderTeacherList() {

    const keyword = document.getElementById('searchTeacher').value.toLowerCase();
    const filterGender = document.getElementById('filterGender').value;

    const teacherList = document.getElementById('teacherList');

    const filtered = teacherData.filter(teacher => {
        const matchKeyword = teacher.name.toLowerCase().includes(keyword);
        const matchGender = filterGender === 'semua' || teacher.gender === filterGender;
        return matchKeyword && matchGender;
    });

    document.getElementById('selectAllTeachers').checked = false;
    toggleDeleteButton();

    if (!filtered.length) {

        teacherList.innerHTML = `

            <div
                class="
                    col-span-full
                    bg-white
                    rounded-3xl
                    p-8
                    text-center
                    shadow-sm
                "
            >
                <div class="text-5xl mb-3">
                    👨‍🏫
                </div>
                Tidak ada data guru
            </div>
        `;
        return;
    }

    teacherList.innerHTML = filtered.map(teacher => `

            <div
                class="
                    bg-white
                    rounded-3xl
                    p-5
                    shadow-sm
                    flex flex-col justify-between
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
                        <input type="checkbox" class="teacher-checkbox w-5 h-5 mt-1 rounded text-blue-600 border-slate-300" value="${teacher.id}">
                        <div>
                            <div class="text-lg font-bold">
                                ${teacher.name}
                            </div>
                            <div class="mt-1 text-sm text-slate-500">
                                ${teacher.gender}
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
                                teacher.active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }
                        "
                    >
                        ${
                            teacher.active
                            ? 'Aktif'
                            : 'Nonaktif'
                        }
                    </span>

                </div>

                <div
                    class="
                        flex
                        gap-2
                        mt-5
                    "
                >

                    <button
                        class="
                            edit-btn
                            flex-1
                            h-11
                            bg-blue-600
                            text-white
                            rounded-2xl
                        "
                        data-id="${teacher.id}"
                    >
                        Edit
                    </button>

                    <button
                        class="
                            status-btn
                            flex-1
                            h-11
                            bg-slate-700
                            text-white
                            rounded-2xl
                        "
                        data-id="${teacher.id}"
                        data-active="${teacher.active}"
                    >
                        ${
                            teacher.active
                            ? 'Nonaktifkan'
                            : 'Aktifkan'
                        }
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
                        "
                        data-id="${teacher.id}"
                        title="Hapus Guru"
                    >
                        <i class="fa-solid fa-trash-can text-lg"></i>
                    </button>

                </div>

            </div>

        `).join('');

    bindTeacherActions();

}

function bindTeacherActions() {

    document.querySelectorAll('.teacher-checkbox').forEach(cb => {
        cb.addEventListener('change', () => {
            const allChecked = document.querySelectorAll('.teacher-checkbox:not(:checked)').length === 0;
            document.getElementById('selectAllTeachers').checked = allChecked;
            toggleDeleteButton();
        });
    });

    document
        .querySelectorAll('.edit-btn')
        .forEach(button => {

            button.addEventListener(
                'click',
                () => {

                    const teacher =
                        teacherData.find(
                            item =>
                                item.id ===
                                button.dataset.id
                        );

                    editTeacherId =
                        teacher.id;

                    document
                        .getElementById(
                            'teacherName'
                        )
                        .value =
                        teacher.name;

                    document
                        .getElementById(
                            'teacherGender'
                        )
                        .value =
                        teacher.gender;

                    document
                        .getElementById(
                            'saveTeacher'
                        )
                        .textContent =
                        'Update Guru';

                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });

                }
            );

        });

    document
        .querySelectorAll('.status-btn')
        .forEach(button => {

            button.addEventListener(
                'click',
                async () => {

                    const current =
                        button.dataset.active
                        === 'true';

                    await toggleTeacherStatus(
                        button.dataset.id,
                        !current
                    );

                    teacherData =
                        await getTeachers();

                    renderTeacherList();

                }
            );

        });

    document
        .querySelectorAll('.delete-btn')
        .forEach(button => {

            button.addEventListener(
                'click',
                async () => {

                    const result = await Swal.fire({
                        title: 'Apakah Anda yakin?',
                        text: 'Semua data absensi terkait guru ini juga akan ikut terhapus.',
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

                    await deleteTeacher(
                        button.dataset.id
                    );

                    teacherData =
                        await getTeachers();

                    renderTeacherList();

                }
            );

        });

}