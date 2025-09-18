<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'display_name',
        'email',
        'gender',
        'avatar',
        'bg_image',
        'count',
        'href',
        'desc',
        'job_name',
        'address',
    ];

    // Laravel sẽ tự quản lý created_at và updated_at
    public $timestamps = true;
}
