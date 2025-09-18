<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
   public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'name' => $this->name,
        'email' => $this->email,
        'email_verified_at' => $this->email_verified_at?->toISOString(),
        'role' => $this->role,
        'password' => $this->password, // thường không trả, nhưng nếu cần giống mẫu
        'profilePic' => $this->profile_pic,
        'nickname' => $this->nickname,
        'dob' => $this->dob?->format('Y-m-d'),
        'phone' => $this->phone,
        'gender' => $this->gender,
        'address' => $this->address,
        'remember_token' => $this->remember_token,
        'createdAt' => $this->created_at?->toISOString(),
        'updatedAt' => $this->updated_at?->toISOString(),
    ];
}

}
