<?php

namespace App\Http\Controllers\Chat;

use App\Model\User;
use App\Model\Message;
use App\Model\ChatRoom;
use App\Model\Receiver;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Storage;
use App\Events\Chat\PrivateMessageEvent;

class ChatController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $auth       = auth()->user();
        $authUserId = $auth->id;
        $userId     = $request->receiver_id;
        return Message::leftJoin('users', 'users.id', '=', 'messages.user_id')
            ->join('receivers', 'receivers.message_id', '=', 'messages.id')
            ->where('messages.user_id', '=', $authUserId) //done
            ->where('receivers.receiver_id', '=', $userId) // done
            ->orWhere('messages.user_id', '=', $userId) //done
            ->where('receivers.receiver_id', '=', $authUserId)
        // ->select('users.name as user', 'users.image', 'users.image_path', 'users.id as userId', 'messages.message', 'messages.file_path', 'messages.file_name', 'messages.type', 'messages.created_at as time', 'receivers.user_id as r_user_id')
            ->orderBy("messages.created_at", "DESC")
            ->paginate(15);
        return $output;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user                  = user();
        $senderID              = $user->id;
        $channel               = $request->channel;
        $file                  = $request->file("send_attachment");
        $message               = new Message;
        $message->chat_room_id = $channel["channel_id"] ?? null;
        $message->user_id      = $senderID;
        $message->message      = $request->message;
        $message->document     = $request->hasFile("send_attachment") ? $this->document($file) : null;
        $message->type         = 1;
        $message->save();

        $receiver              = new Receiver;
        $receiver->message_id  = $message->id;
        $receiver->receiver_id = $channel["receiver_id"] ?? null;

        if ($receiver->save()) {
            $message = Message::with('sender')->find($message->id);
            broadcast(new PrivateMessageEvent($message))->toOthers();
            return $message;
        }
        return ['Something went wrong!!'];
    }

    public function document($file)
    {
        if ($file->isValid()) {
            $name          = preg_replace('/\s+/', '-', $file->getClientOriginalName());
            $hashDirectory = Str::random(40);
            $key           = "documents/{$hashDirectory}/" . $name;
            $thumbnailKey  = "documents/{$hashDirectory}/" . "245-245-" . $name;
            $disk          = Storage::disk('public');
            $disk->put($key, file_get_contents($file));
            $mime = $file->getMimeType();

            $isImage = $this->isImage($mime);
            if ($isImage) {
                $thumbnail = Image::make($file->getRealPath())->fit(245, 245,
                    function ($constraint) {
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    })->encode($file->getClientOriginalExtension(), 80);
                $disk->put($thumbnailKey, $thumbnail);
            }
            return $document = [
                "name"          => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
                "url"           => $key,
                "thumbnail_url" => $isImage ? $thumbnailKey : null,
                "mime"          => $mime,
                "preview_url"   => null,
                "preview"       => null,
                "shared_id"     => Str::random(50),
                "file_size"     => $this->filesizeFormat($file->getSize()),
            ];
        }
    }

    public function isImage($mime)
    {
        $pos = strpos($mime, "image");

        if (false === $pos) {
            return false;
        }

        return true;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function filesizeFormat($size)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        $power = $size > 0 ? floor(log($size, 1024)) : 0;
        return number_format($size / pow(1024, $power), 2, '.', ',') . ' ' . $units[$power];
    }

    public function chatRoom($receiverId)
    {
        $request      = request();
        $user         = user();
        $receiver     = User::find($receiverId);
        $receiverId   = $receiver->id;
        $roomType     = $request->get("room_type") ?? 'private';
        $senderUserId = $user->id;
        $roomMembers  = [$receiverId, $senderUserId];
        sort($roomMembers);
        $roomMembersMatch = "'" . json_encode($roomMembers) . "'";
        $chatRoom         = ChatRoom::whereRaw("JSON_CONTAINS(user_ids,{$roomMembersMatch})")
            ->where("room_type", $roomType)->first();

        if (is_null($chatRoom)) {
            $chatRoom            = new ChatRoom;
            $chatRoom->room_type = $roomType;
            $chatRoom->user_ids  = $roomMembers;
            $chatRoom->save();
        }
        return $chatRoom;
    }
}
