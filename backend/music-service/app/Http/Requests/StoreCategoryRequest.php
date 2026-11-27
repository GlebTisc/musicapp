<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'        => [
                'required',
                'string',
                'min:1',
                'max:100',
                Rule::unique('mongodb.categories', 'name')
            ],
            'slug'        => [
                'required',
                'string',
                'min:1',
                'max:100',
                'regex:/^[a-z0-9-]+$/',
                Rule::unique('mongodb.categories', 'slug')
            ]
        ];
    }
}
