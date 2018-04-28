<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Message extends Model
{
    use SoftDeletes;

    protected $guarded = ["id"];
    protected $casts   = [
        'document' => 'array',
    ];

    protected $appends = ["url", "thumbnail_url"];

    public function getUrlAttribute()
    {
        $document = empty($this->attributes["document"]) ?? null;

        if (!$document) {
            return asset("storage/" .
                json_decode($this->attributes["document"])->url);
        }
    }

    public function getThumbnailUrlAttribute()
    {
        $document = empty($this->attributes["document"]) ?? null;
        if (!$document) {
            return asset("storage/" . json_decode($this->attributes["document"])->thumbnail_url);
        }
    }

    public function user()
    {
        return $this->belongsTo(User::class, "user_id", "id");
    }

    public function sender()
    {
        return $this->belongsTo(User::class, "user_id", "id");
    }

    public function receivers()
    {
        return $this->hasMany(Receiver::class, "message_id", "id");
    }

}
