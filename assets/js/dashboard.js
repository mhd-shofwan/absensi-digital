import { db } from './firebase.js';

import {
    collection,
    getDocs,
    query,
    where,
    onSnapshot
}
from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

export async function getDashboardData() {

    const eventSnapshot =
        await getDocs(
            query(
                collection(db, 'events'),
                where('status', '==', 'open')
            )
        );

    if (eventSnapshot.empty) {
        return null;
    }

    const event =
        eventSnapshot.docs[0];

    const eventId =
        event.id;

    const eventData =
        event.data();

    const teacherSnapshot =
        await getDocs(
            collection(db, 'teachers')
        );

    const attendanceSnapshot =
        await getDocs(
            collection(db, 'attendances')
        );

    const teachers =
        teacherSnapshot.docs.map(
            doc => ({
                id: doc.id,
                ...doc.data()
            })
        );

    const attendances =
        attendanceSnapshot.docs
            .map(doc => doc.data())
            .filter(item =>
                item.eventId === eventId
            );

    const teachersList = teachers.filter(t => t.active).map(t => {
        const att = attendances.find(a => a.teacherId === t.id);
        return {
            ...t,
            attendanceStatus: att ? (att.status || 'hadir') : 'alpha'
        };
    }).sort((a, b) => a.name.localeCompare(b.name));

    const totalTeachers = teachersList.length;
    
    const hadirCount = teachersList.filter(t => t.attendanceStatus === 'hadir').length;
    const sakitCount = teachersList.filter(t => t.attendanceStatus === 'sakit').length;
    const izinCount = teachersList.filter(t => t.attendanceStatus === 'izin').length;
    const alfaCount = teachersList.filter(t => t.attendanceStatus === 'alpha').length;

    const ikhwanList = teachersList.filter(t => t.gender === 'ikhwan');
    const akhwatList = teachersList.filter(t => t.gender === 'akhwat');

    const ikhwanTotal = ikhwanList.length;
    const akhwatTotal = akhwatList.length;

    const ikhwanPresent = ikhwanList.filter(t => t.attendanceStatus === 'hadir').length;
    const akhwatPresent = akhwatList.filter(t => t.attendanceStatus === 'hadir').length;

    const percentage =
        totalTeachers
            ? Math.round(
                hadirCount /
                totalTeachers *
                100
            )
            : 0;

    return {

        eventTitle:
            eventData.title,

        ikhwanTotal,
        ikhwanPresent,

        akhwatTotal,
        akhwatPresent,

        totalTeachers,
        hadirCount,
        sakitCount,
        izinCount,
        alfaCount,

        percentage,

        eventId: event.id,
        eventTitle: eventData.title,
        teachersList

    };

}

export function subscribeDashboard(
    callback
) {

    let timeout = null;
    const trigger = async () => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(async () => {
            const data = await getDashboardData();
            callback(data);
        }, 100);
    };

    const unsubAttendances = onSnapshot(collection(db, 'attendances'), trigger);
    const unsubEvents = onSnapshot(collection(db, 'events'), trigger);
    const unsubTeachers = onSnapshot(collection(db, 'teachers'), trigger);

    return () => {
        unsubAttendances();
        unsubEvents();
        unsubTeachers();
    };

}