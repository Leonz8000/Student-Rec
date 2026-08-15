<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students_recs', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('student_name');
            $table->string('School_email');
            $table->unsignedInteger('phone_number');
            $table->string('address');
            $table->string('course');
            $table->string('year');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students_recs');
    }
};
