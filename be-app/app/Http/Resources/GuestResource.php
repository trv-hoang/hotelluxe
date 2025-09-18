<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GuestResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'email'      => $this->email,
            'password'   => $this->password, // ⚠️ chỉ để demo, thực tế không trả password
            'role'       => $this->role,
            'profilePic' => $this->profile_pic,
            'createdAt'  => $this->created_at,
            'updatedAt'  => $this->updated_at,
            'nickname'   => $this->nickname,
            'dob'        => optional($this->dob)->toDateString(),
            'phone'      => $this->phone,
            'gender'     => $this->gender,
            'address'    => $this->address,
        ];
    }
}
