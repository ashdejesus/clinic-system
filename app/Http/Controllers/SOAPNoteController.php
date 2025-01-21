<?php

namespace App\Http\Controllers;

use App\Models\SoapNote;
use App\Models\User;
use Illuminate\Http\Request;

class SoapNoteController extends Controller
{
    // Fetch all SOAP notes for a specific user
    public function index($id)
    {
        $user = User::findOrFail($id); // Ensure user exists
        $soapNotes = $user->soapNotes; // Retrieve SOAP notes for this user

        return response()->json($soapNotes);
    }

    // Store a new SOAP note for a specific user
    public function store(Request $request, $id)
    {
        $user = User::findOrFail($id); // Ensure user exists

        // Validate input data
        $request->validate([
            'subjective' => 'required|string',
            'objective' => 'required|string',
            'assessment' => 'required|string',
            'plan' => 'required|string',
        ]);

        // Create the SOAP note
        $soapNote = $user->soapNotes()->create([
            'subjective' => $request->subjective,
            'objective' => $request->objective,
            'assessment' => $request->assessment,
            'plan' => $request->plan,
        ]);

        return response()->json($soapNote, 201); // Return the created SOAP note
    }
}
