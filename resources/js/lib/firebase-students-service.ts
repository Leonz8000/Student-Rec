import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  where,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase-config';

export interface StudentRecord {
  id?: string;
  student_name: string;
  School_email: string;
  phone_number: number;
  address: string;
  course: string;
  year: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const COLLECTION_NAME = 'students_recs';

/**
 * Get all student records
 */
export async function getStudentRecords(): Promise<StudentRecord[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        student_name: data.student_name || '',
        School_email: data.School_email || '',
        phone_number: data.phone_number || 0,
        address: data.address || '',
        course: data.course || '',
        year: data.year || '',
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      } as StudentRecord;
    });
  } catch (error) {
    console.error('Error fetching student records:', error);
    // Return empty array on error instead of throwing
    return [];
  }
}

/**
 * Check if an email already exists (excluding a specific document ID)
 */
export async function checkEmailExists(email: string, excludeId?: string): Promise<boolean> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('School_email', '==', email.toLowerCase())
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return false;
    }

    // If excludeId is provided, check if any other documents have this email
    if (excludeId) {
      return querySnapshot.docs.some((doc) => doc.id !== excludeId);
    }

    return true;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
}

/**
 * Add a new student record
 */
export async function addStudentRecord(data: StudentRecord): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding student record:', error);
    throw error;
  }
}

/**
 * Update an existing student record
 */
export async function updateStudentRecord(
  id: string,
  data: Partial<StudentRecord>
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating student record:', error);
    throw error;
  }
}

/**
 * Delete a student record
 */
export async function deleteStudentRecord(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting student record:', error);
    throw error;
  }
}
