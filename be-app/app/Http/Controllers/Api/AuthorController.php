<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;   
use App\Models\Author;
use App\Http\Resources\AuthorResource;

class AuthorController extends Controller
{
    public function index()
    {
        return AuthorResource::collection(Author::all());
    }

    public function show($id)
    {
        return new AuthorResource(Author::findOrFail($id));
    }
}
