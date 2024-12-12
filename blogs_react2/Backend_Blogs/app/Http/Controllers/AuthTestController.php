<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthTestController extends Controller
{
    //

    public function index(){
        //dd('test');
        try {
            $data = $request->validated();
        
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => bcrypt($data['password']),
            ]);
        
            $token = $user->createToken('main')->plainTextToken;
        
            return response([
                'user' => $user,
                'token' => $token,
            ], 201); // 201 Created status code
        } catch (\Exception $e) {
            return response([
                'error' => 'Failed to create user.',
                'message' => $e->getMessage(),
            ], 500); // 500 Internal Server Error
        }
    }
}
