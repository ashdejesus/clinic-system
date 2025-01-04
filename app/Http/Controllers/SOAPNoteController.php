<?php

namespace App\Http\Controllers;
use App\Models\SOAPNote;
use App\Models\Patient;
use Illuminate\Http\Request;

class SOAPNoteController extends Controller
{
    public function store(Request $request, $patientId)
    {
        $request->validate([
            'subjective' => 'required|string',
            'objective' => 'required|string',
            'assessment' => 'required|string',
            'plan' => 'required|string',
        ]);

        $patient = Patient::findOrFail($patientId);

        $soapNote = new SOAPNote();
        $soapNote->patient_id = $patient->id;
        $soapNote->subjective = $request->subjective;
        $soapNote->objective = $request->objective;
        $soapNote->assessment = $request->assessment;
        $soapNote->plan = $request->plan;
        $soapNote->save();

        return response()->json(['message' => 'SOAP note added successfully'], 201);
    }

    public function index($patientId)
    {
        $patient = Patient::findOrFail($patientId);
        $soapNotes = $patient->soapNotes; // Assuming a relationship is defined in the Patient model

        return response()->json($soapNotes, 200);
    }
}
