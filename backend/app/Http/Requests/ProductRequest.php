<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
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
        $rules = [
            'name'             => ['required', 'string', 'min:3', 'max:100'],
            'description'      => ['required', 'string', 'min:10', 'max:500'],
            'price'            => ['required', 'numeric', 'min:0.01'], 
            'stock_quantity'   => ['required', 'integer', 'min:0'], 
            'unit'             => ['required', 'string', 'in:kg,piece,litre,pack,botte'], 
            'reduction'        => ['nullable', 'integer', 'min:0', 'max:100'],
            'image'            => ['nullable', 'image', 'max:2048'], // Fichier image, max 2 Mo.
        ];
        
    // Cela permet à un utilisateur de n'envoyer que les champs qu'il souhaite modifier 
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['name'] = ['sometimes', 'string', 'min:3', 'max:100'];
            $rules['description'] = ['sometimes', 'string', 'min:10', 'max:500'];
        }
        
        return $rules;
    }
}
