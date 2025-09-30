<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:30',
            'password' => 'required|string|min:6',
            'role' => 'required|in:agriculteur,acheteur',
            'farmName' => 'nullable|string|max:255',
            'companyName' => 'nullable|string|max:255',
            'avatar' => 'nullable|image|max:2048',
            'documents.*' => 'nullable|file|max:4096',
        ]);

        // upload avatar if provided
        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
        }

        // upload any identity documents (optional)
        $docPaths = [];
        if ($request->hasFile('documents')) {
            foreach ((array)$request->file('documents') as $file) {
                if ($file) {
                    $docPaths[] = $file->store('identity_docs', 'public');
                }
            }
        }

        // create user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'],
            'role' => $validated['role'],
            'farm_name' => $validated['farmName'] ?? null,
            'company_name' => $validated['companyName'] ?? null,
            'avatar' => $avatarPath,
            'identity_docs' => $docPaths ? json_encode($docPaths) : null,
        ]);

        // Issue token if Sanctum is enabled
        if (method_exists($user, 'createToken')) {
            $token = $user->createToken('farmlink')->plainTextToken;
        } else {
            $token = null;
        }

        return response()->json([
            'message' => 'Inscription réussie',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar_url' => $avatarPath ? Storage::disk('public')->url($avatarPath) : null,
            ],
            'token' => $token,
        ], 201);
    }
}
