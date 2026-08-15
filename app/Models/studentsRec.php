<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class studentsRec extends Model
{
    /** @use HasFactory<\Database\Factories\StudentsRecFactory> */
    use HasFactory;
    protected $fillable = [
        'student_name',
        'School_email',
        'phone_number',
        'address',
        'course',
        'year',
    ];

}

