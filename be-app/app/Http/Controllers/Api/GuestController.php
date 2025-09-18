<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller; 
use App\Http\Resources\GuestResource;
use App\Models\Guest;

class GuestController extends Controller
{
    public function index()
    {
        return GuestResource::collection(Guest::all());
    }

    public function show($id)
    {
        return new GuestResource(Guest::findOrFail($id));
    }
}
