<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMusicRequest extends FormRequest
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
            'title'       => ['required', 'string', 'min:1', 'max:200'],
            'artist'      => ['required', 'string', 'min:1', 'max:200'],
            'category_id' => ['required', 'string', 'regex:/^[0-9a-fA-F]{24}$/'],
            'duration'    => ['sometimes', 'integer', 'min:1'],
            'url'         => ['sometimes', 'string', 'url', 'max:500'],
            'cover_url'   => ['sometimes', 'string', 'url', 'max:500'],
            'year'        => ['sometimes', 'integer', 'min:1900', 'max:2100']
        ];
    }
}
