<?php

namespace App\Model;

use App\Model\ChatRoom;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = ["id"];
    protected $casts   = [
        "profile_images" => "array",
    ];
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];
    protected $appends = ["avatar_url", "active", "my_channel_id", "you_name"];

    public function getAvatarUrlAttribute()
    {
        if ($this->attributes["profile_images"]) {
            return asset("storage/" . json_decode($this->attributes["profile_images"])[0]);
        }
    }
    public function getMyChannelIDAttribute()
    {
        $roomType    = "private";
        $user        = user();
        $roomMembers = [$this->id, $user->id];
        sort($roomMembers);
        $json     = "'" . json_encode($roomMembers) . "'";
        $chatRoom = ChatRoom::whereRaw("JSON_CONTAINS(user_ids,{$json})")
            ->where("room_type", $roomType)->first();
        if (is_null($chatRoom)) {
            $chatRoom            = new ChatRoom;
            $chatRoom->room_type = $roomType;
            $chatRoom->user_ids  = $roomMembers;
            $chatRoom->save();
        }
        return $chatRoom->id;
    }

    public function getActiveAttribute()
    {
        return user()->id === $this->id;
    }

    public function getYouNameAttribute()
    {
        return user()->id === $this->id ? "{$this->name} - You " : $this->name;
    }

    public function messages()
    {
        return $this->hasMany(Message::class, "user_id", "id");
    }

    public function receivers()
    {
        return $this->hasMany(Receiver::class, "user_id", "id");
    }

}
