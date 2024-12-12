<?php

namespace App\Http\Controllers;

use App\Models\Comment;

use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id)
{
    $comments = Comment::where('blogId', $id)->with('user')->orderBy('created_at', 'desc')->get();
    return response()->json($comments);
}


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $id)
    {
        // Set a testing user ID (can be any integer you want to test with)
       
    
        // Validate the incoming data
        $validatedData = $request->validate([
            'comment' => 'required|string',
            'userid' => 'numeric',
        ]);
    
        // Add the blogId and userid to the validated data
        $validatedData['blogId'] = $id;
      
    
        // Create the comment in the database
        $comment = Comment::create($validatedData);
    
        // Return the comment with a 201 status
        return response()->json($comment, 201);
    }
    

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
