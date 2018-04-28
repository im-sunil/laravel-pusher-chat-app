<?php

use App\Model\Message;

/*Route::get("chatroom/{receiverId}", function ($receiverId) {

$receiver     = User::find($receiverId);
$roomType     = 'private';
$senderUserId = 1;
$roomMembers  = [$receiver->id, $senderUserId];
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
return $chatRoom;
});*/

Route::get('private-chat', 'Chat\ChatController@store')
    ->name('private.chat.store');

Route::get("check-relationship", function () {
    $auth       = auth()->user();
    $authUserId = $auth->id;
    $receiverId = 19;

    return Message::with("user", "receivers", "receivers.user")
        ->whereHas("receivers", function ($query) use ($receiverId, $authUserId) {
            $query->where('receivers.user_id', '=', $receiverId);
        })
        ->where("user_id", $authUserId)
        ->paginate();
});
