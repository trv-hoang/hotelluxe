<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'firstName'   => $this->first_name,
            'lastName'    => $this->last_name,
            'displayName' => $this->display_name,
            'email'       => $this->email,
            'gender'      => $this->gender,
            'avatar'      => $this->avatar,
            'bgImage'     => $this->bg_image,
            'count'       => $this->count,
            'href'        => $this->href,
            'desc'        => $this->desc,
            'jobName'     => $this->job_name,
            'address'     => $this->address,
            'createdAt'   => $this->created_at,
            'updatedAt'   => $this->updated_at,
        ];
    }
}
