import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Nasyid } from '../types/nasyid';

const COLLECTION_NAME = 'nasyid';

/**
 * Listens to real-time changes in the 'nasyid' collection ordered by 'judul' ASC
 */
export function subscribeNasyidList(
  onData: (list: Nasyid[]) => void,
  onError: (error: Error) => void
) {
  const colRef = collection(db, COLLECTION_NAME);

  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Nasyid[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        judul: docSnap.data().judul || '',
        lirik: docSnap.data().lirik || '',
        images: docSnap.data().images || [],
      }));
      // Sort client-side for 100% resilience against missing indexes
      list.sort((a, b) => a.judul.localeCompare(b.judul));
      onData(list);
    },
    (err) => {
      console.error('Firestore onSnapshot error:', err);
      onError(err);
    }
  );
}

/**
 * Fetch a single Nasyid document by ID
 */
export async function getNasyidById(id: string): Promise<Nasyid | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      judul: docSnap.data().judul || '',
      lirik: docSnap.data().lirik || '',
      images: docSnap.data().images || [],
    };
  }
  return null;
}

/**
 * Add a new Nasyid document
 */
export async function addNasyid(data: { judul: string; images: string[]; lirik?: string }) {
  const colRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(colRef, {
    judul: data.judul,
    images: data.images,
    ...(data.lirik ? { lirik: data.lirik } : {}),
  });
  return docRef.id;
}

/**
 * Update an existing Nasyid document
 */
export async function updateNasyid(
  id: string,
  data: { judul: string; images: string[]; lirik?: string }
) {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    judul: data.judul,
    images: data.images,
    ...(data.lirik !== undefined ? { lirik: data.lirik } : {}),
  });
}

/**
 * Delete a Nasyid document
 */
export async function deleteNasyid(id: string) {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
