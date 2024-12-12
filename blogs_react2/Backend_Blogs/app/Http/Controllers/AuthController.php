<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;

class AuthController extends Controller
{

    public function signup(Request $request)
    {
        try {
            // Perform validation with detailed error messages
            $data = $request->validate(
                [
                    'name' => 'required|string|max:255',
                    'email' => 'required|email|string|max:255|unique:users,email',
                    'password' => [
                        'required',
                        'confirmed',
                        'min:8',
                    ],
                ],
                [
                    'name.required' => 'Name is required.',
                    'email.required' => 'Email is required.',
                    'email.email' => 'The email must be a valid email address.',
                    'email.unique' => 'This email is already in use.',
                    'password.min' => 'Password must be at least 8 characters.',
                    'password.mixed_case' => 'Password must include both uppercase and lowercase letters.',
                    'password.numbers' => 'Password must include at least one number.',
                    'password.symbols' => 'Password must include at least one symbol.',
                    'password.confirmed' => 'Password confirmation does not match.',
                ]
            );

            // dd($data);

            // Create the user
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
            ]);

            // Generate a token
            $token = $user->createToken('main')->plainTextToken;

            return response([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'token' => $token,
            ], 201); // 201 Created status code
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response([
                'error' => 'Validation failed.',
                'errors' => $e->errors(), // Return all validation errors
            ], 422); // 422 Unprocessable Entity
        } catch (\Exception $e) {
            return response([
                'error' => 'Failed to create user.',
                'message' => config('app.debug') ? $e->getMessage() : 'Something went wrong. Please try again later.',
            ], 500); // 500 Internal Server Error
        }
    }


    public function login(Request $request)
    {
        try {
            // Validate the login request
            $data = $request->validate([
                'email' => 'required|string|email|max:255',
                'password' => 'required|string|min:8',
                'remember' => 'boolean', // Optional field for "remember me"
            ], [
                'email.required' => 'Email is required.',
                'email.email' => 'Please provide a valid email address.',
                'password.required' => 'Password is required.',
                'password.min' => 'Password must be at least 8 characters.',
            ]);

            $remember = $data['remember'] ?? false;
            unset($data['remember']); // Remove remember from credentials

            // Attempt authentication
            if (!Auth::attempt($data, $remember)) {
                return response([
                    'error' => 'The provided credentials are not correct.',
                ], 422);
            }

            // Generate the user and token
            $user = Auth::user();
            $token = $user->createToken('main')->plainTextToken;

            return response([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'token' => $token,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response([
                'error' => 'The Provided credentials are not correct.',
                'message' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response([
                'error' => 'Login failed.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    public function logout(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        // Revoke the token that was used to authenticate the current request...
        $user->currentAccessToken()->delete();

        return response([
            'success' => true
        ]);
    }
}
