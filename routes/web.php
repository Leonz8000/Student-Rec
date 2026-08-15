<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentsRecController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('dashboard', [StudentsRecController::class, 'index'])->name('dashboard');
    Route::post('studentsRec', [StudentsRecController::class, 'store'])->name('studentsRec.store');
    Route::put('studentsRec/{studentsRec}', [StudentsRecController::class, 'update'])->name('studentsRec.update');
    Route::delete('studentsRec/{studentsRec}', [StudentsRecController::class, 'destroy'])->name('studentsRec.destroy');
});


require __DIR__.'/settings.php';
