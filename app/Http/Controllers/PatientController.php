<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Patient;

class PatientController extends Controller
{

    public function store(Request $request)
{
    $request->validate([
        'full_name' => 'required|string|max:255',
        'date_of_birth' => 'required|date',
        'contact_number' => 'required|string|max:15',
    ]);

    $patient = new Patient();
    $patient->full_name = $request->full_name;
    $patient->date_of_birth = $request->date_of_birth;
    $patient->contact_number = $request->contact_number;
    $patient->save();

    return response()->json(['message' => 'Patient added successfully', 'patient' => $patient], 201);
}


    public function index()
    {
        $patients = Patient::all();

        return response()->json($patients, 200);
    }
}
