import { db } from './firebase.js';

import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc,
    query,
    where,
    writeBatch,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

export async function getEvents() {

    const snapshot =
        await getDocs(
            collection(db, 'events')
        );

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

}

export async function addEvent(data) {

    await addDoc(
        collection(db, 'events'),
        {
            title: data.title,
            date: data.date,
            status: 'closed',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }
    );

}

export async function updateEvent(id, data) {

    await updateDoc(
        doc(db, 'events', id),
        {
            title: data.title,
            date: data.date,
            updatedAt: serverTimestamp()
        }
    );

}

export async function closeEvent(id) {

    await updateDoc(
        doc(db, 'events', id),
        {
            status: 'closed',
            updatedAt: serverTimestamp()
        }
    );

}

export async function openEvent(id) {

    const q = query(
        collection(db, 'events'),
        where('status', '==', 'open')
    );

    const snapshot =
        await getDocs(q);

    for (const item of snapshot.docs) {

        await updateDoc(
            item.ref,
            {
                status: 'closed',
                updatedAt: serverTimestamp()
            }
        );

    }

    await updateDoc(
        doc(db, 'events', id),
        {
            status: 'open',
            updatedAt: serverTimestamp()
        }
    );

}

export async function deleteEvent(id) {
    const q = query(collection(db, 'attendances'), where('eventId', '==', id));
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    
    snapshot.forEach(docSnap => {
        batch.delete(docSnap.ref);
    });
    
    batch.delete(doc(db, 'events', id));
    await batch.commit();
}