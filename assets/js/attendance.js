import { db } from './firebase.js';

import {
    collection,
    getDocs,
    getDoc,
    setDoc,
    deleteDoc,
    doc,
    query,
    where,
    onSnapshot,
    serverTimestamp
}
    from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

export async function getActiveEvent() {

    const q = query(
        collection(db, 'events'),
        where('status', '==', 'open')
    );

    const snapshot =
        await getDocs(q);

    console.log(
        'Active Event Count:',
        snapshot.size
    );

    if (snapshot.empty) {
        return null;
    }

    const event =
        snapshot.docs[0];

    return {
        id: event.id,
        ...event.data()
    };

}

export function subscribeActiveEvent(callback) {
    const q = query(
        collection(db, 'events'),
        where('status', '==', 'open')
    );

    return onSnapshot(q, snapshot => {
        if (snapshot.empty) {
            callback(null);
        } else {
            const event = snapshot.docs[0];
            callback({
                id: event.id,
                ...event.data()
            });
        }
    });
}

export function subscribeTeachers(
    callback
) {

    return onSnapshot(
        collection(db, 'teachers'),
        snapshot => {

            const teachers =
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

            callback(teachers);

        }
    );

}

export function subscribeAttendances(
    callback
) {

    return onSnapshot(
        collection(db, 'attendances'),
        snapshot => {

            const attendances =
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

            callback(attendances);

        }
    );

}

export async function saveAttendance(
    teacher
) {

    const event =
        await getActiveEvent();

    if (!event) {
        return false;
    }

    const attendanceId =
        `${event.id}_${teacher.id}`;

    const attendanceRef =
        doc(
            db,
            'attendances',
            attendanceId
        );

    const attendanceSnap =
        await getDoc(
            attendanceRef
        );

    if (attendanceSnap.exists()) {
        return false;
    }

    await setDoc(
        attendanceRef,
        {
            eventId: event.id,
            eventTitle: event.title,

            teacherId: teacher.id,
            teacherName: teacher.name,

            gender: teacher.gender,
            status: 'hadir',

            deviceUuid:
                localStorage.getItem(
                    'device_uuid'
                ),

            createdAt:
                serverTimestamp()
        }
    );

    return true;

}

export async function setAdminAttendance(event, teacherId, teacherName, teacherGender, status) {
    const attendanceId = `${event.id}_${teacherId}`;
    const attendanceRef = doc(db, 'attendances', attendanceId);

    if (status === 'alpha') {
        const snap = await getDoc(attendanceRef);
        if (snap.exists()) {
            await deleteDoc(attendanceRef);
        }
    } else {
        await setDoc(attendanceRef, {
            eventId: event.id,
            eventTitle: event.title,
            teacherId: teacherId,
            teacherName: teacherName,
            gender: teacherGender,
            status: status,
            deviceUuid: 'admin',
            updatedAt: serverTimestamp()
        }, { merge: true });
    }
}

export async function getAttendancesByEvent(eventId) {
    const q = query(
        collection(db, 'attendances'),
        where('eventId', '==', eventId)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}