<?php

namespace App\Http\Controllers;

use App\Models\SOAPNote;
use App\Models\User;
use Illuminate\Http\Request;

class SOAPNoteController extends Controller
{
    /**
     * Fetch all SOAP notes for a specific user.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function index($id)
    {
        $user = User::findOrFail($id); // Ensure user exists
        $soapNotes = $user->soapNotes()->latest()->get(); // Retrieve and order SOAP notes by latest

        return response()->json($soapNotes, 200);
    }

    /**
     * Store a new SOAP note for a specific user.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, $id)
    {
        $user = User::findOrFail($id); // Ensure user exists

        // Validate input data
        $validatedData = $request->validate([
            'subjective' => 'required|string|max:1000',
            'objective' => 'required|string|max:1000',
            'assessment' => 'required|string|max:1000',
            'plan' => 'required|string|max:1000',
        ]);

        // Create the SOAP note
        $soapNote = $user->soapNotes()->create($validatedData);

        return response()->json(['message' => 'SOAP Note added successfully', 'soap--note' => $soapNote], 201);
    }

    /**
     * Delete a specific SOAP note for a user.
     *
     * @param int $userId
     * @param int $noteId
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($userId, $noteId)
    {
        $user = User::findOrFail($userId); // Ensure user exists
        $note = $user->soapNotes()->findOrFail($noteId); // Find the specific SOAP note

        $note->delete();

        return response()->json(['message' => 'SOAP Note deleted successfully'], 204);
    }
}
