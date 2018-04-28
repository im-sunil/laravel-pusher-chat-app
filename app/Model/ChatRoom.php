<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class ChatRoom extends Model
{
    protected $guarded = ["id"];
    protected $casts   = [
        'user_ids' => 'array',
    ];

    public function messages()
    {
        return $this->hasMany(Message::class, 'chat_room_id', "id")->with('user');
    }
}
