import { db } from './firebase.js';

import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

export async function getPendingDevices() {

    const q = query(
        collection(db, 'devices'),
        where('approved', '==', false)
    );

    const snapshot =
        await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

export async function approveDevice(uuid) {

    await updateDoc(
        doc(db, 'devices', uuid),
        {
            approved: true
        }
    );
}

export async function revokeDevice(uuid) {

    await updateDoc(
        doc(db, 'devices', uuid),
        {
            approved: false
        }
    );
}

export async function getDevices() {

    const snapshot =
        await getDocs(
            collection(
                db,
                'devices'
            )
        );

    return snapshot.docs.map(
        doc => ({
            id: doc.id,
            ...doc.data()
        })
    );

}

export async function updateDeviceName(
    id,
    deviceName
) {

    await updateDoc(
        doc(
            db,
            'devices',
            id
        ),
        {
            deviceName,
            updatedAt:
                serverTimestamp()
        }
    );

}

export async function deleteDevice(uuid) {
    await deleteDoc(doc(db, 'devices', uuid));
}