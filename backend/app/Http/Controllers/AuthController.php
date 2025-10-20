<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\RegisterRequest;
use App\Mail\WelcomeMails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    public function signUp(RegisterRequest $request){


        $data = $request->validated();
        if($request->hasFile('profile')){
            $path=$request->file('profile')->store('img','public');
            $data['profile']=$path;
        }
        $user = User::create($data);
        Mail::to($user->email)->send(new WelcomeMails($user));

        return response()->json([
            'message'=>'utilisateur créé avec succés',
            'status'=>201,
            'user'=>$user
        ],201);
    }

    public function Update(Request $request){

        $user = Auth::user();
        $data = $request->validate([
            'name'=> ['required','min:4'],
            'email'=> ['required','min:4', Rule::unique('users')->ignore($user->id)],
            'address'=> ['required','min:4'],
            'phone'=> ['required','regex:/^0[1-9][0-9]{8}$/'],
            'first_name' =>['required','min:4'],
        ]);
       if ($request->hasFile('profile')) {
        // Supprime l'ancienne image si elle existe et n'est pas default
        if ($user->profile && Storage::disk('public')->exists($user->profile)) {
            Storage::disk('public')->delete($user->profile);
        }

        // Stocke la nouvelle image
        $path = $request->file('profile')->store('img', 'public');
        $data['profile'] = $path;
    }
        $user->update($data);

        return response()->json([
            'message'=>'utilisateur modifié avec succés',
            'status'=>200,
            'user'=>$user
        ]);
    }


    public function delete(Request $request){
        $user = $request->user();
        $user->delete();
        return response()->json([
            'message'=>'compte supprimé avec succés',
            'status'=>200
        ]);
    }
    //Authentification jwt
    public function signIn(LoginRequest $request){
        if(!Auth::attempt($request->only('email','password'))){
            return response()->json([
                'message' => 'mots de passe ou email incorrect',
                'status'=>401
            ],401);
        }

        $user = User::where('email',$request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token'=>$token,
            'type'=>'Bearer',
            'message'=>'utilisateur connecté avec succés',
            'status'=>200,
            'user'=>$user
        ],200);
    }



    public function createUser(){
        // Dupont
User::create([
  'name' => 'Dupont',
  'email' => 'dupont@example.com',
  'first_name' => 'Jean',
  'phone' => '0600000001',
  'address' => '10 rue de Paris, Limoges',
  'farmer' => true,
  'company_name' => 'Ferme Dupont',
  'customer' => false,
  'admin' => false,
  'password' => Hash::make('1234'),
  'profile' => 'dupont.jpg',
]);

// Martin
User::create([
  'name' => 'Martin',
  'email' => 'martin@example.com',
  'first_name' => 'Lucie',
  'phone' => '0600000002',
  'address' => '12 rue Victor Hugo, Limoges',
  'farmer' => true,
  'company_name' => 'Les Jardins Martin',
  'customer' => false,
  'admin' => false,
  'password' => Hash::make('1234'),
  'profile' => 'martin.jpg',
]);

// Durand
User::create([
  'name' => 'Durand',
  'email' => 'durand@example.com',
  'first_name' => 'Paul',
  'phone' => '0600000003',
  'address' => '8 rue de Lyon, Limoges',
  'farmer' => false,
  'company_name' => null,
  'customer' => true,
  'admin' => false,
  'password' => Hash::make('1234'),
  'profile' => 'durand.jpg',
]);

// Admin
User::create([
  'name' => 'Admin',
  'email' => 'admin@example.com',
  'first_name' => 'Super',
  'phone' => '0600000004',
  'address' => '1 avenue République',
  'farmer' => false,
  'company_name' => null,
  'customer' => false,
  'admin' => true,
  'password' => Hash::make('admin'),
  'profile' => 'admin.png',
]);
    }
}
