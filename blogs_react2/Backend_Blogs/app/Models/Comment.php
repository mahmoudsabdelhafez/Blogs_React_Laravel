<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'blogId', // يجب أن يكون مطابقًا لاسم الحقل في قاعدة البيانات
        'comment', // النص الخاص بالتعليق
        'name',    // اسم المعلق
        'email',   // البريد الإلكتروني
         'userid' // المستخدم المرتبط بالتعليق
    ];

    public function blog()
{
    return $this->belongsTo(Blog::class , 'blogId');
}

function user(){
    return $this->belongsTo(User::class , 'userid');
}

}
