import { db } from './firebase.js';

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

/**
 * Ambil UUID perangkat
 */
function generateUuid() {

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function(c) {

            const r =
                Math.random() * 16 | 0;

            const v =
                c === 'x'
                ? r
                : (r & 0x3 | 0x8);

            return v.toString(16);

        });
}

export function getDeviceUuid() {

    let uuid =
        localStorage.getItem(
            'device_uuid'
        );

    if (!uuid) {

        uuid = generateUuid();

        localStorage.setItem(
            'device_uuid',
            uuid
        );

    }

    return uuid;
}

/**
 * Registrasi device ke Firestore
 */
export async function registerDevice() {

    const uuid = getDeviceUuid();

    const deviceRef =
        doc(db, 'devices', uuid);

    const deviceSnap =
        await getDoc(deviceRef);

    if (!deviceSnap.exists()) {

        await setDoc(deviceRef, {
            uuid,
            deviceName: '',
            approved: false,
            createdAt: serverTimestamp()
        });

        console.log(
            'Device berhasil didaftarkan'
        );

    }

    return uuid;
}

/**
 * Cek status approval
 */
export async function getDeviceStatus() {

    const uuid = getDeviceUuid();

    const deviceRef =
        doc(db, 'devices', uuid);

    const deviceSnap =
        await getDoc(deviceRef);

    if (!deviceSnap.exists()) {
        return false;
    }

    return deviceSnap.data().approved;
}