import { db } from './firebase.js';

import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc,
    writeBatch,
    query,
    where,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

export async function addTeacher(data) {

    return await addDoc(
        collection(db, 'teachers'),
        {
            name: data.name,
            gender: data.gender,
            active: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }
    );

}

export async function getTeachers() {

    const snapshot =
        await getDocs(
            collection(db, 'teachers')
        );

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

}

export async function updateTeacher(id, data) {

    await updateDoc(
        doc(db, 'teachers', id),
        {
            name: data.name,
            gender: data.gender,
            updatedAt: serverTimestamp()
        }
    );

}

export async function toggleTeacherStatus(
    id,
    active
) {

    await updateDoc(
        doc(db, 'teachers', id),
        {
            active,
            updatedAt: serverTimestamp()
        }
    );

}

export async function deleteTeacher(id) {
    const q = query(collection(db, 'attendances'), where('teacherId', '==', id));
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    
    snapshot.forEach(docSnap => {
        batch.delete(docSnap.ref);
    });
    
    batch.delete(doc(db, 'teachers', id));
    await batch.commit();
}