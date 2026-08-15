import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
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
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
    const q = query(collection(db, COLLECTION_NAME), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as StudentRecord));
  } catch (error) {
    console.error('Error fetching student records:', error);
    throw error;
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
