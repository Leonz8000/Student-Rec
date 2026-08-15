import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { useEffect, useState } from 'react';
import { dashboard } from '@/routes';
import {
  getStudentRecords,
  addStudentRecord,
  updateStudentRecord,
  deleteStudentRecord,
  type StudentRecord,
} from '@/lib/firebase-students-service';

export default function Dashboard() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(false);
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

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const phoneNum = parseInt(formData.phone_number, 10);

      await addStudentRecord({
        student_name: formData.student_name,
        School_email: formData.School_email,
        phone_number: phoneNum,
        address: formData.address,
        course: formData.course,
        year: formData.year,
      });

      setFormData({
        student_name: '',
        School_email: '',
        phone_number: '',
        address: '',
        course: '',
        year: '',
      });
      setErrors({});

      // Refresh the list
      await fetchStudents();
    } catch (error) {
      console.error('Error saving student record:', error);
      setErrors({ submit: 'Failed to save student record' });
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
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div>
          <h1 className="text-x1 font-semibold">Students</h1>
          <p className="text-sm text-muted-foreground">Add a Student Record</p>

          <form
            onSubmit={submit}
            className="max-w-x1 space-y-2 rounded-x1 border p-4"
          >
            {errors.submit && (
              <p className="text-sm text-red-600">{errors.submit}</p>
            )}

            <div className="space-y-2">
              <label htmlFor="student_name">Name</label>
              <Input
                id="student_name"
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
              {loading ? 'Saving...' : 'Save Student Record'}
            </Button>
          </form>
        </div>

        {/* Student Records Table */}
        <div className="mt-8">
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
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-2 text-sm">
                        {student.student_name}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {student.School_email}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {student.phone_number}
                      </td>
                      <td className="px-4 py-2 text-sm">{student.address}</td>
                      <td className="px-4 py-2 text-sm">{student.course}</td>
                      <td className="px-4 py-2 text-sm">{student.year}</td>
                      <td className="px-4 py-2 text-sm">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(student.id)}
                          disabled={loading}
                        >
                          Delete
                        </Button>
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
