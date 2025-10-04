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
        $data = $request->validated();

        if($request->hasFile('profile')){
            $path=$request->file('profile')->store('img','public');
            $data['profile']=$path;
        }

        $user = User::create($data);
        return response()->json([
            'message'=>'utilisateur créé avec succés',
            'user' => $user
        ],201);
    }

    //Authentification jwt
    public function signIn(LoginRequest $request){
        if(!Auth::attempt($request->only('email','password'))){
            return response()->json([
                'message' => 'mots de passe ou email incorrect',
                'status'=>401
            ]);
        }

        $user = User::where('email',$request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token'=>$token,
            'type'=>'Bearer',
            'message'=>'utilisateur connecté avec succés',
            'status'=>200
        ])->cookie('jwt',$token);
    }
}
