<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
            'name'=> ['required','min:4'],
            'email'=> ['required','min:4','unique:users,email','email'],
            'password'=> ['required','confirmed','min:8'],
            'address'=> ['required','min:4'],
            'phone'=> ['required','regex:/^0[1-9][0-9]{8}$/'],
            'first_name' =>['required','min:4'],
            'farmer'=>['boolean'],
            'customer'=>['boolean'],
            'admin'=>['boolean']
        ];
    }
    public function messages(): array
    {
        return[
            'email.unique'=>'Cet email existe déjà',
            'password.confirmed'=>'Les mots de passes ne correspondent pas'
        ];
    }
}
