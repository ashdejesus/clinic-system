<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SoapNoteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true; // Adjust authorization logic as needed
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'subjective' => 'required|string|max:1000',
            'objective' => 'required|string|max:1000',
            'assessment' => 'required|string|max:1000',
            'plan' => 'required|string|max:1000',
        ];
    }

    /**
     * Customize the validation error messages.
     *
     * @return array<string, string>
     */
    public function messages()
    {
        return [
            'subjective.required' => 'The subjective field is required.',
            'objective.required' => 'The objective field is required.',
            'assessment.required' => 'The assessment field is required.',
            'plan.required' => 'The plan field is required.',
        ];
    }
}
