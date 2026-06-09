import { showAdminMenu } from './admin-menu.js';

export function showTutorialPage(content) {
    content.innerHTML = `
        <div class="max-w-4xl mx-auto space-y-6">
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

            <div class="bg-white rounded-3xl p-8 shadow-sm">
                <div class="text-4xl mb-4">💡</div>
                <h2 class="text-2xl font-bold mb-6">Cara Penggunaan Aplikasi</h2>
                
                <div class="space-y-6 text-slate-600 leading-relaxed">
                    <div class="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                        <h3 class="font-bold text-lg text-blue-800 mb-2">1. Kelola Data Guru</h3>
                        <p>Langkah pertama adalah memasukkan data guru pada menu <strong>"Guru"</strong>. Anda bisa menambahkannya secara manual satu per satu, atau melalui fitur import xlsx/csv. Untuk upload massal, Anda bisa download dulu contoh format datanya di file <code>example.csv</code>.</p>
                    </div>

                    <div class="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
                        <h3 class="font-bold text-lg text-indigo-800 mb-2">2. Membuat dan Mengaktifkan Event</h3>
                        <p>Setelah data guru masuk, silakan buat event baru pada menu <strong>"Event"</strong> dengan memasukkan nama dan tanggal. <em>(Catatan: Tanggal hanya untuk keperluan identifikasi, tidak ada kaitannya dengan aktif/tidaknya event).</em></p>
                        <p class="mt-2">Setelah itu, silakan aktifkan event untuk memulai absensi. <strong>Penting: Hanya bisa ada 1 event yang aktif dalam satu waktu.</strong> Jika Anda mengaktifkan event lain, maka event yang saat ini sedang aktif akan otomatis menjadi nonaktif.</p>
                    </div>

                    <div class="bg-purple-50 p-5 rounded-2xl border border-purple-100">
                        <h3 class="font-bold text-lg text-purple-800 mb-2">3. Verifikasi Perangkat Absensi</h3>
                        <p>Selanjutnya, masuk ke menu <strong>"Perangkat"</strong>. Pada tablet/layar perangkat absensi, pastikan sudah membuka aplikasi absensi dan di sana akan muncul ID Perangkat.</p>
                        <p class="mt-2">Pilih ID perangkat yang sesuai pada halaman admin ini, lalu klik <strong>Setujui (Approve)</strong>. Untuk mempermudah identifikasi ke depannya, silakan ubah nama (rename) perangkat tersebut dengan mengklik tombol edit yang tersedia.</p>
                    </div>

                    <div class="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                        <h3 class="font-bold text-lg text-emerald-800 mb-2">4. Memantau dan Mengoreksi Absensi (Dashboard)</h3>
                        <p>Admin dapat melihat <strong>Dashboard</strong> dari event yang sedang aktif. Di menu ini, admin dapat melakukan <em>override</em> (ubah paksa) absensi, yakni mengubah status dari Alpha menjadi Sakit, atau Izin.</p>
                        <p class="mt-2">Anda juga bisa memperbaiki kesalahan absensi di sini. Misalnya jika ada orang yang salah klik absen (Hadir), Anda bisa mengubahnya kembali menjadi Alpha. Atau sebaliknya, jika sebelumnya Izin ternyata mendadak Hadir, admin juga bisa mengubahnya langsung.</p>
                    </div>

                    <div class="bg-amber-50 p-5 rounded-2xl border border-amber-100">
                        <h3 class="font-bold text-lg text-amber-800 mb-2">5. Mengunduh Laporan</h3>
                        <p>Gunakan menu <strong>"Laporan"</strong> untuk melihat daftar hadir dari event yang telah selesai. Di sana Anda dapat mengunduh rekap absensinya ke dalam bentuk file Excel (.xlsx).</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('backAdmin').addEventListener('click', () => {
        localStorage.setItem('activePage', 'admin');
        showAdminMenu(content);
    });
}
