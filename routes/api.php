<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\SOAPNoteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public Routes
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes (Authenticated Users)
Route::middleware('auth:sanctum')->group(function () {
    // Auth and User Routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::apiResource('/users', UserController::class);

    // Patient Routes
    Route::get('/patients', [PatientController::class, 'index']);
    Route::post('/patients', [PatientController::class, 'store']);
    Route::get('/patients/search', [PatientController::class, 'search']); // Optional Search Route

    // SOAP Note Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users/{id}/soap-notes', [SoapNoteController::class, 'index']); // Get SOAP notes for a specific user
    Route::post('/users/{id}/soap-notes', [SoapNoteController::class, 'store']); // Add a SOAP note for a specific user
});

});
