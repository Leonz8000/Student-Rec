import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { useEffect, useState } from 'react';
import { dashboard } from '@/routes';
import { Trash2, Edit2 } from 'lucide-react';
import {
  getStudentRecords,
  addStudentRecord,
  updateStudentRecord,
  deleteStudentRecord,
  checkEmailExists,
  type StudentRecord,
} from '@/lib/firebase-students-service';

export default function Dashboard() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    student_name: '',
    School_email: '',
    phone_number: '',
    address: '',
    course: '',
    year: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch student records on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      setLoading(true);
      const records = await getStudentRecords();
      setStudents(records);
    } catch (error) {
      console.error('Failed to fetch student records:', error);
    } finally {
      setLoading(false);
    }
  }

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    if (!formData.student_name.trim()) {
      newErrors.student_name = 'Name is required';
    }
    if (!formData.School_email.trim()) {
      newErrors.School_email = 'Email is required';
    }
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.course.trim()) {
      newErrors.course = 'Course is required';
    }
    if (!formData.year.trim()) {
      newErrors.year = 'Year is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function startEdit(student: StudentRecord) {
    setEditingId(student.id || null);
    setFormData({
      student_name: student.student_name,
      School_email: student.School_email,
      phone_number: student.phone_number.toString(),
      address: student.address,
      course: student.course,
      year: student.year,
    });
    setErrors({});
  }

  function cancelEdit() {
    setEditingId(null);
    setFormData({
      student_name: '',
      School_email: '',
      phone_number: '',
      address: '',
      course: '',
      year: '',
    });
    setErrors({});
  }

  function getFilteredStudents(): StudentRecord[] {
    if (!searchQuery.trim()) {
      return students;
    }

    const query = searchQuery.toLowerCase();
    return students.filter(
      (student) =>
        student.student_name.toLowerCase().includes(query) ||
        student.School_email.toLowerCase().includes(query)
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const phoneNum = parseInt(formData.phone_number, 10);

      // Check for duplicate email (excluding current record if editing)
      const emailExists = await checkEmailExists(formData.School_email, editingId || undefined);
      if (emailExists) {
        setErrors({ School_email: 'This email is already in use' });
        setLoading(false);
        return;
      }

      if (editingId) {
        // Update existing record
        await updateStudentRecord(editingId, {
          student_name: formData.student_name,
          School_email: formData.School_email,
          phone_number: phoneNum,
          address: formData.address,
          course: formData.course,
          year: formData.year,
        });
      } else {
        // Create new record
        await addStudentRecord({
          student_name: formData.student_name,
          School_email: formData.School_email,
          phone_number: phoneNum,
          address: formData.address,
          course: formData.course,
          year: formData.year,
        });
      }

      cancelEdit();
      setErrors({});

      // Refresh the list
      await fetchStudents();
    } catch (error) {
      console.error('Error saving student record:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save student record';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string | undefined) {
    if (!id) return;

    if (!confirm('Are you sure you want to delete this record?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteStudentRecord(id);
      await fetchStudents();
    } catch (error) {
      console.error('Error deleting student record:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 gap-4 overflow-auto rounded-xl p-4">
        {/* Form Section */}
        <div className="w-1/3 flex-shrink-0">
          <h1 className="text-x1 font-semibold">Students</h1>
          <p className="text-sm text-muted-foreground">Add a Student Record</p>

          <form
            onSubmit={submit}
            className="space-y-2 rounded-x1 border p-4"
          >
            
            {errors.submit && (
              <p className="text-sm text-red-600">{errors.submit}</p>
            
            )}

            <div className="space-y-2">
              <label htmlFor="student_name">Name</label>
              <Input
                id="student_name"
                placeholder="Enter student name"
                value={formData.student_name}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    student_name: event.target.value,
                  }))
                }
                disabled={loading}
              />
              {errors.student_name && (
                <p className="text-sm text-red-600">{errors.student_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="School_email">School Email</label>
              <Input
                id="School_email"
                placeholder="Enter school email"
                value={formData.School_email}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    School_email: event.target.value,
                  }))
                }
                disabled={loading}
              />
              {errors.School_email && (
                <p className="text-sm text-red-600">{errors.School_email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="phone_number">Phone Number</label>
              <Input
                id="phone_number"
                placeholder="Enter phone number"
                value={formData.phone_number}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    phone_number: event.target.value,
                  }))
                }
                disabled={loading}
              />
              {errors.phone_number && (
                <p className="text-sm text-red-600">{errors.phone_number}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="address">Address</label>
              <Input
                id="address"
                placeholder="Enter address"
                value={formData.address}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: event.target.value,
                  }))
                }
                disabled={loading}
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="course">Course</label>
              <Input
                id="course"
                placeholder="Enter course"
                value={formData.course}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    course: event.target.value,
                  }))
                }
                disabled={loading}
              />
              {errors.course && (
                <p className="text-sm text-red-600">{errors.course}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="year">Year</label>
              <Input
                id="year"
                placeholder="Enter year"
                value={formData.year}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    year: event.target.value,
                  }))
                }
                disabled={loading}
              />
              {errors.year && (
                <p className="text-sm text-red-600">{errors.year}</p>
              )}
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingId ? 'Update Student Record' : 'Save Student Record'}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={cancelEdit} disabled={loading}>
                Cancel
              </Button>
            )}
          </form>

          {/* Search Section */}
          <div className="mt-4 space-y-2">
            <label htmlFor="search">Search Student</label>
            <Input
              id="search"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border">
              {getFilteredStudents().length > 0 ? (
                <ul className="divide-y">
                  {getFilteredStudents().map((student) => (
                    <li
                      key={student.id}
                      className="cursor-pointer px-3 py-2 hover:bg-gray-900 transition-colors"
                      onClick={() => {
                        startEdit(student);
                        setSearchQuery('');
                      }}
                    >
                      <div className="text-sm font-medium text-white">
                        {student.student_name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {student.School_email}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No students found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Student Records Table */}
        <div className="flex-1 overflow-x-auto">
          <h2 className="text-lg font-semibold">Student Records</h2>
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {!loading && students.length === 0 && (
            <p className="text-sm text-gray-500">No student records found</p>
          )}
          {!loading && students.length > 0 && (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Phone
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Address
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Course
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Year
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b hover:bg-gray-900 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-2 text-sm text-white">
                        {student.student_name}
                      </td>
                      <td className="px-4 py-2 text-sm text-white">
                        {student.School_email}
                      </td>
                      <td className="px-4 py-2 text-sm text-white">
                        {student.phone_number}
                      </td>
                      <td className="px-4 py-2 text-sm text-white">{student.address}</td>
                      <td className="px-4 py-2 text-sm text-white">{student.course}</td>
                      <td className="px-4 py-2 text-sm text-white">{student.year}</td>
                      <td className="px-4 py-2 text-sm">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(student)}
                            disabled={loading}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(student.id)}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

Dashboard.layout = {
  breadcrumbs: [
    {
      title: 'Dashboard',
      href: dashboard(),
    },
  ],
};
