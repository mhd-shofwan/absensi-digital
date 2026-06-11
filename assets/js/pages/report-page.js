import { showAdminMenu } from './admin-menu.js';
import { getEvents } from '../events.js';
import { getTeachers } from '../teachers.js';
import { getAttendancesByEvent } from '../attendance.js';

export async function showReportPage(content) {
    content.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <!-- HEADER -->
            <button
                id="btnBack"
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
                    mb-6
                "
            >
                ← Kembali
            </button>

            <div class="mb-6">
                <h1 class="text-2xl font-bold">Laporan Absensi</h1>
                <p class="text-slate-500 text-sm">Unduh rekap kehadiran dalam format Excel</p>
            </div>

            <!-- CONTENT -->
            <div class="bg-white rounded-3xl p-6 shadow-sm">
                <div class="mb-6">
                    <label class="block text-sm font-medium text-slate-700 mb-2">Pilih Event</label>
                    <select
                        id="eventSelect"
                        class="w-full h-12 px-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    >
                        <option value="">Memuat data...</option>
                    </select>
                </div>

                <button
                    id="btnDownload"
                    disabled
                    class="w-full h-16 text-lg bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                    <span class="text-xl">📊</span> Download Excel
                </button>
            </div>
        </div>
    `;

    document.getElementById('btnBack').addEventListener('click', () => {
        localStorage.setItem('activePage', 'admin');
        showAdminMenu(content);
    });

    const eventSelect = document.getElementById('eventSelect');
    const btnDownload = document.getElementById('btnDownload');

    try {
        const events = await getEvents();
        // Sort descending by date or creation? We assume descending order of date
        events.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (events.length === 0) {
            eventSelect.innerHTML = '<option value="">Belum ada event dibuka</option>';
        } else {
            eventSelect.innerHTML = '<option value="">-- Pilih Event --</option>';
            events.forEach(event => {
                const option = document.createElement('option');
                option.value = event.id;
                // Save formatted date for filename
                const d = new Date(event.date);
                const formatter = new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
                option.dataset.formattedDate = formatter.format(d).replace(/ /g, '-');
                option.dataset.title = event.title;
                option.textContent = `${event.title} - ${d.toLocaleDateString('id-ID')}`;
                eventSelect.appendChild(option);
            });
        }
    } catch (err) {
        eventSelect.innerHTML = '<option value="">Gagal memuat event</option>';
    }

    eventSelect.addEventListener('change', () => {
        btnDownload.disabled = !eventSelect.value;
    });

    btnDownload.addEventListener('click', async () => {
        if (!eventSelect.value) return;
        
        const originalText = btnDownload.innerHTML;
        btnDownload.disabled = true;
        btnDownload.innerHTML = '<span class="text-xl">⏳</span> Memproses...';

        try {
            const eventId = eventSelect.value;
            const selectedOption = eventSelect.options[eventSelect.selectedIndex];
            const eventTitle = selectedOption.dataset.title;
            const eventDateStr = selectedOption.dataset.formattedDate; // e.g., 09-Juni-2026

            // Fetch Teachers & Attendances
            const teachers = await getTeachers();
            const attendances = await getAttendancesByEvent(eventId);

            // Create a lookup for attendance
            const attendanceMap = {};
            attendances.forEach(att => {
                attendanceMap[att.teacherId] = att;
            });

            // Process data
            const ikhwanData = [];
            const akhwatData = [];
            
            let noIkhwan = 1;
            let noAkhwat = 1;

            // Sort teachers by name
            teachers.sort((a, b) => a.name.localeCompare(b.name));

            teachers.forEach(teacher => {
                const att = attendanceMap[teacher.id];
                
                let jamKedatangan = '-';
                let status = 'Tanpa Keterangan';
                
                if (att) {
                    status = (att.status === 'hadir' ? 'Hadir' : (att.status === 'sakit' ? 'Sakit' : (att.status === 'izin' ? 'Izin' : 'Tanpa Keterangan')));
                    
                    if (att.status === 'hadir' && (att.createdAt || att.updatedAt)) {
                        const ts = att.createdAt || att.updatedAt;
                        if (ts && ts.toDate) {
                            const date = ts.toDate();
                            jamKedatangan = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                        }
                    }
                }

                const genderStr = (teacher.gender || '').toLowerCase().trim();
                const isIkhwan = genderStr === 'ikhwan' || genderStr === 'l';

                const rowData = {
                    "No": isIkhwan ? noIkhwan++ : noAkhwat++,
                    "Nama Guru": teacher.name,
                    "Jam Kedatangan": jamKedatangan,
                    "Absensi": status
                };

                if (isIkhwan) {
                    ikhwanData.push(rowData);
                } else {
                    akhwatData.push(rowData);
                }
            });

            // If empty, add placeholder
            if (ikhwanData.length === 0) ikhwanData.push({ "No": "-", "Nama Guru": "Belum ada data", "Jam Kedatangan": "-", "Absensi": "-" });
            if (akhwatData.length === 0) akhwatData.push({ "No": "-", "Nama Guru": "Belum ada data", "Jam Kedatangan": "-", "Absensi": "-" });

            // Create Workbook and Worksheets using SheetJS
            const wb = XLSX.utils.book_new();
            
            const wsIkhwan = XLSX.utils.json_to_sheet(ikhwanData);
            const wsAkhwat = XLSX.utils.json_to_sheet(akhwatData);

            XLSX.utils.book_append_sheet(wb, wsIkhwan, "Ikhwan");
            XLSX.utils.book_append_sheet(wb, wsAkhwat, "Akhwat");

            // Safe filename
            const safeTitle = eventTitle.replace(/[^a-zA-Z0-9]/g, '_');
            const fileName = `${safeTitle}_${eventDateStr}.xlsx`;

            // Download
            XLSX.writeFile(wb, fileName);

        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Gagal memproses laporan. ' + error.message, 'error');
        } finally {
            btnDownload.disabled = false;
            btnDownload.innerHTML = originalText;
        }
    });
}
