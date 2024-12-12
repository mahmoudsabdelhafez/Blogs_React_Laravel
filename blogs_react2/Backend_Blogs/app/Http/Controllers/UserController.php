<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    // public function show()
    // {
    //     // Retrieve and return the authenticated user
    //     $user = auth()->user();
    
    //     return response()->json($user);
    // }

    public function show($id)
    {
        
    
        // Fetch user data with blog count
        $userData = User::withCount('blog')->findOrFail($id);
    
        return response()->json($userData);
    }

    
    

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
  public function update(Request $request, string $id)
{
    $user = User::findOrFail($id);

    // Validate the incoming request data
    $request->validate([
        'name' => 'required|string|max:255',
        'about' => 'nullable|string',
        'address' => 'nullable|string',
        'email' => 'required|email|max:255|unique:users,email,' . $user->id,
        'password' => 'nullable|string|min:6',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validate the image
    ]);

    // Update user details
    $user->name = $request->name;
    $user->about = $request->about;
    $user->address = $request->address;
    $user->email = $request->email;

    // Check if password was provided, then hash it
    if ($request->password) {
        $user->password = bcrypt($request->password);
    }

    // Handle the image upload
    if ($request->hasFile('image')) {
        // Delete the old image if it exists (optional step)
        if ($user->image && file_exists(public_path('storage/' . $user->image))) {
            unlink(public_path('storage/' . $user->image)); // Delete the old image
        }

        // Store the new image and save its path
        $imagePath = $request->file('image')->store('profile_images', 'public');
        $user->image = $imagePath;
    }

    // Save the updated user details to the database
    $user->save();

    return response()->json($user, 200);
}



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
