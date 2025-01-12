<?php

namespace App\Http\Controllers;

use App\Models\SOAPNote;
use App\Models\Patient;
use Illuminate\Http\Request;

class SOAPNoteController extends Controller
{
    /**
     * Store a new SOAP note for a patient.
     *
     * @param Request $request
     * @param int $patientId
     * @return \Illuminate\Http\JsonResponse
     */
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

        return response()->json($soapNote, 201); // Return the created SOAP note
    }

    /**
     * Get all SOAP notes for a specific patient.
     *
     * @param int $patientId
     * @return \Illuminate\Http\JsonResponse
     */
    public function index($patientId)
    {
        $patient = Patient::findOrFail($patientId);
        $soapNotes = $patient->soapNotes; // Assuming a relationship is defined in the Patient model

        return response()->json($soapNotes, 200);
    }

    /**
     * Search SOAP notes for a specific patient.
     *
     * @param Request $request
     * @param int $patientId
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request, $patientId)
    {
        $request->validate([
            'query' => 'required|string|min:1',
        ]);

        $patient = Patient::findOrFail($patientId);

        // Search for SOAP notes based on the query
        $query = $request->input('query');
        $soapNotes = $patient->soapNotes()->where(function ($q) use ($query) {
            $q->where('subjective', 'LIKE', "%{$query}%")
              ->orWhere('objective', 'LIKE', "%{$query}%")
              ->orWhere('assessment', 'LIKE', "%{$query}%")
              ->orWhere('plan', 'LIKE', "%{$query}%");
        })->get();

        return response()->json($soapNotes, 200);
    }
}