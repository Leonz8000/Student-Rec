import { Head } from '@inertiajs/react';
import {Button} from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { useForm } from '@inertiajs/react';
import { dashboard } from '@/routes';


export default function Dashboard() {
    const form = useForm({student_name: '', School_email: '', phone_number: '', address: '', course: '', year: ''});

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.post('/studentsRec', {
            onSuccess: () => form.reset(),
        });
    }
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-x1 font-semibold">Students</h1>
                    <p className="text-sm text-muted-foreground">
                        Add a Student Record
                    </p>

                <form onSubmit= {submit} className="max-w-x1 space-y-2 rounded-x1 border p-4">
                    
                    <div className="space-y-2">
                    <label htmlFor="student_name">Name</label>
                    <Input 
                        id="student_name" 
                        value={form.data.student_name} 
                        onChange={(event)=> form.setData('student_name', event.target.value)}
                        />
                        {form.errors.student_name && <p className="text-sm text-red-600">{form.errors.student_name}</p>} 
                    </div>


                    <div className="space-y-2">
                    <label htmlFor="School_email">School Email</label>
                    <Input 
                        id="School_email" 
                        value={form.data.School_email} 
                        onChange={(event)=> form.setData('School_email', event.target.value)}
                        />
                        {form.errors.School_email && <p className="text-sm text-red-600">{form.errors.School_email}</p>} 
                    </div>
                    <div className="space-y-2">
                    <label htmlFor="phone_number">Phone Number</label>
                    <Input 
                        id="phone_number" 
                        value={form.data.phone_number} 
                        onChange={(event)=> form.setData('phone_number', event.target.value)}
                        />
                        {form.errors.phone_number && <p className="text-sm text-red-600">{form.errors.phone_number}</p>} 

                    </div>
                     <div className="space-y-2">
                    <label htmlFor="address">Address</label>
                    <Input 
                        id="address" 
                        value={form.data.address} 
                        onChange={(event)=> form.setData('address', event.target.value)}
                        />
                        {form.errors.address && <p className="text-sm text-red-600">{form.errors.address}</p>} 

                    </div>
                     <div className="space-y-2">
                    <label htmlFor="course">Course</label>
                    <Input 
                        id="course" 
                        value={form.data.course} 
                        onChange={(event)=> form.setData('course', event.target.value)}
                        />
                        {form.errors.course && <p className="text-sm text-red-600">{form.errors.course}</p>} 

                    </div>
                     <div className="space-y-2">
                    <label htmlFor="year">Year</label>
                    <Input 
                        id="year" 
                        value={form.data.year} 
                        onChange={(event)=> form.setData('year', event.target.value)}
                        />
                        {form.errors.year && <p className="text-sm text-red-600">{form.errors.year}</p>} 

                    </div>
                    <Button type="submit" disabled={form.processing}>Save Student Record</Button>
                </form>



                </div>
                

                
                {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div> */}

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
