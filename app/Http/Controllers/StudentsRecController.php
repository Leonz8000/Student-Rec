<?php

namespace App\Http\Controllers;

use App\Models\studentsRec;
use Illuminate\Http\Request;
use Inertia\Inertia;    

class StudentsRecController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('dashboard');
    }

    /**
     * Show the form for creating a new resource.
     */
    // public function create()
    // {
    //     //
    // }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'student_name' => 'required', 'string', 'max:100',
            'School_email' => 'required', 'string', 'max:100',
            'phone_number' => 'required', 'integer', 'max:11',
            'address' => 'required', 'string', 'max:100',
            'course' => 'required', 'string', 'max:100',
            'year' => 'required', 'string', 'max:100',
        ]);
        
        StudentsRec::create($data);
        return redirect()->route ('dashboard');
    }

    /**
     * Display the specified resource.
     */
    // public function show(studentsRec $studentsRec)
    // {
    //     //
    // }

    // /**
    //  * Show the form for editing the specified resource.
    //  */
    // public function edit(studentsRec $studentsRec)
    // {
    //     //
    // }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, studentsRec $studentsRec)
    {
         $data = $request->validate([
            'student_name' => 'required', 'string', 'max:100',
            'School_email' => 'required', 'string', 'max:100',
            'phone_number' => 'required', 'integer', 'max:11',
            'address' => 'required', 'string', 'max:100',
            'course' => 'required', 'string', 'max:100',
            'year' => 'required', 'string', 'max:100',
        ]);

        $studentsRec->update($data);
        return redirect()->route('dashboard');  
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(studentsRec $studentsRec)
    {
        $studentsRec->delete();
        return redirect()->route('dashboard');
    }
}
