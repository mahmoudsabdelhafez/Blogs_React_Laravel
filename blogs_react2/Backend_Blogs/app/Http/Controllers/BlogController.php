<?php

namespace App\Http\Controllers;



use App\Models\Blog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        // Retrieve the category_id from the request
        $categoryId = $request->query('category');
    
        // Base query with eager loading for relationships
        $query = Blog::with(['category', 'user', 'comments']);
    
        // If a category is selected, filter blogs by that category
        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }
    
        // Execute the query to get the blogs
        $blogs = $query->orderBy('created_at', 'desc')->get();
    
        // Return the blogs (filtered or not) as JSON
        return response()->json($blogs);
    }
    
   
    public function store(Request $request)
    {
        // Validate the incoming data
        $validated = $request->validate(
            [
                'user_Id' => 'required|numeric',
                'title' => 'string|max:255',
                'image' => 'required|string',  // Change: Validate image as a URL
                'article' => 'required|string',
                'category_id' => 'numeric',
                'short_description'=>'nullable| string'
            ],
            [
                'title.required' => 'The title field is required.',
                'image.required' => 'An image URL is required.',
                'image.url' => 'The image must be a valid URL.',
                'article.required' => 'The article field is required.',
            ]
        );
    
        try {
            // Assign the image URL to the validated data (no file upload logic needed)
            $validated['image'] = $request->input('image');  // Using the provided URL
    
            // Create the blog entry
            $blog = Blog::create($validated);
    
            return response()->json(['message' => 'Blog created successfully', 'blog' => $blog], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create blog', 'details' => $e->getMessage()], 500);
        }
    }
    
    

    /**
     * Display the specified resource.
     */
    public function show($id)
{
    $blog = Blog::with(['user' , 'category'])->find($id);

    if (!$blog) {
        return response()->json(['message' => 'Blog not found'], 404);
    }

    return response()->json($blog);
}

    /**
     * Update the specified resource in storage.
     */
    
     public function update(Request $request, $id)
     {
         // Validate the incoming data
        //  Log::info('Update Request Data: ', ['data' => $request->all]);
         $validatedData = $request->validate([
             'title' => 'nullable|string|max:255', 
             'article' => 'nullable|string',
             'category_id' => 'nullable|integer',
             'image' => 'nullable|string', 
         ]);
     
         // Find the blog by ID
         $blog = Blog::find($id);
         if (!$blog) {
             return response()->json(['message' => 'Blog not found'], 404);
         }
     
         // Update fields only if they are provided
         if ($request->has('title')) {
             $blog->title = $validatedData['title'];
         }
         if ($request->has('article')) {
             $blog->article = $validatedData['article'];
         }
         if ($request->has('category_id')) {
             $blog->category_id = $validatedData['category_id'];
         }
         if ($request->has('image')) {
             $blog->image = $validatedData['image']; // Update the image URL if provided
         }
     
         // Save the updated blog
         $blog->save();
     
         // Return the updated blog
         return response()->json([
             'message' => 'Blog updated successfully',
             'blog' => $blog
         ]);
     }
     
     
     
     
     
    
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Find the blog
        $blog = Blog::find($id);
    
        if (!$blog) {
            return response()->json(['message' => 'Blog not found'], 404);
        }
    
        // Optionally delete the associated image
        if ($blog->image && Storage::exists($blog->image)) {
            Storage::delete($blog->image);
        }
    
        // Delete the blog
        $blog->delete();
    
        return response()->json(['message' => 'Blog deleted successfully']);
    }
    

    public function getBlogUser($id){

        $blogs = Blog::with('user' , 'category')->where('user_id', '=', $id)->get();

        return response()->json($blogs);

    }

    public function getFavoriteBlogs($userId)
    {
        // Retrieve the user's favorite blogs using Query Builder
        $favoriteBlogs = DB::table('blog_user')
            ->join('blogs', 'blog_user.blog_id', '=', 'blogs.id') // Assuming the blogs table has an 'id' column
            ->where('blog_user.user_id', $userId)
            ->select('blogs.*') // Select the desired columns from the blogs table
            ->get();
    
        return response()->json(['favoriteBlogs' => $favoriteBlogs]);
    }
    
    public function addToFavorite(Request $request, $userId, $blogId)
    {
        // Retrieve the user by ID
        $user = User::findOrFail($userId);
    
        // Attach the blog to the user's favorites
        $user->blog_favorites()->attach($blogId);
    
        return response()->json(['message' => 'Blog added to favorites.']);
    }
    public function removeFromFavorite(Request $request, $userId, $blogId)
    {
        // Retrieve the user by ID
        $user = User::findOrFail($userId);

        // Detach the blog from the user's favorites
        $user->blog_favorites()->detach($blogId);

        return response()->json(['message' => 'Blog removed from favorites.']);
    }
    public function isFavorited($userId, $blogId)
    {
        // Retrieve the user by ID
        $user = User::findOrFail($userId);

        // Check if the blog is in the user's favorites
        $isFavorited = $user->blog_favorites()->where('blog_id', $blogId)->exists();

        return response()->json(['isFavorited' => $isFavorited]);
    }
    public function search(Request $request)
    {
        $query = $request->input('query');

        // Example of a search query
        $results = Blog::where('title', 'LIKE', "%$query%")
                    ->orWhere('article', 'LIKE', "%$query%")
                    ->get();

        return response()->json($results);
    }
}
