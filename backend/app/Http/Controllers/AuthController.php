<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function signUp(RegisterRequest $request){
        $user=User::create($request->validated());
        return response()->json([
            'message'=>'utilisateur créé avec succés',
            'user' => $user
        ],201);
    }

    public function signIn(LoginRequest $request){
        if(Auth::attempt($request->only("email","password")))
        {
            $user=Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json(['message'=>'connexion réussie'],200);
        }
        return response()->json(['message'=>'email ou mot de passe incorrect'],401);
    }
}
