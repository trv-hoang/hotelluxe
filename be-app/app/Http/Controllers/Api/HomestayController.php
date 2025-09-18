<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;   
use App\Http\Resources\HomestayResource;
use App\Models\Homestay;

class HomestayController extends Controller
{
    public function index()
    {
        // Trả về danh sách homestay đã format theo HomestayResource
        return HomestayResource::collection(Homestay::all());
    }

    public function show($id)
    {
        // Trả về 1 homestay chi tiết theo id
        return new HomestayResource(Homestay::findOrFail($id));
    }
}
