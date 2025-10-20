<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CommandeRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'total_amount'=>['required','min:1'],
            'delivery_address'=>['required','min:4'],
            'payment_method'=>['required'],
            'products'=>['required','array','min:1'],
            'products.*.product_id'=>['required'],
            'products.*.quantite'=>['required']
        ];
    }
}
