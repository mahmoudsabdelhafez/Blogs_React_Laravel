<?php

use App\Http\Controllers\AiController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthTestController;
use App\Models\Blog;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    Route::post('/logout', [AuthController::class, 'logout']);

});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/user/{id}/show', [UserController::class, 'show']);
Route::put('/user/{id}', [UserController::class, 'update']);

Route::get('/blog', [BlogController::class, 'index']);
Route::post('/blog/store', [BlogController::class, 'store']);
Route::put('blog/{id}/update', [BlogController::class, 'update']);
Route::get('/blogUser/{id}', [BlogController::class, 'getBlogUser']);
Route::delete('blog/{id}/delete', [BlogController::class, 'destroy']);

Route::get('/categories', [CategoryController::class, 'index']);


Route::get('/blogs/{id}/comments', [CommentController::class, 'index']);
Route::get('/blogs/{id}', [BlogController::class, 'show']);
Route::post('/blogs/{id}/comments', [CommentController::class, 'store']);

Route::controller(HomeController::class)->name('home.')->group(function () {
    Route::get('/home', 'index')->name('index');
});





Route::post('/contact' , [ContactController::class , 'store']);

Route::post('/favorites/{userId}/{blogId}', [BlogController::class, 'addToFavorite']);
Route::delete('/favorites/{userId}/{blogId}', [BlogController::class, 'removeFromFavorite']);
Route::get('/favorites/{userId}/{blogId}', [BlogController::class, 'isFavorited']);
Route::get('/favorites/{userId}', [BlogController::class, 'getFavoriteBlogs']);

Route::get('/search', [BlogController::class, 'search']);
Route::post('/getAnswerFromArticle', [AiController::class, 'getAnswerFromArticle']);

Route::post('/generateBlog', [AiController::class, 'generateBlog']);
Route::post('/handleArticleInput', [AiController::class, 'handleArticleInput']);