<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasFactory;


    protected $fillable = [
        'image', 
        'title', 
        'article', 
        'user_Id', 
        'category_id', 
        'likes', 
        'comments_count', 
        'short_description', 
        'published_at'
    ];
    
     
    public function user()
    {
        return $this->belongsTo(User::class , 'user_Id');
    }


    function comments(){
        return $this->hasMany(Comment::class ,'blogId');
    }


    function category(){
        return $this->belongsTo(Category::class);
    }
}
