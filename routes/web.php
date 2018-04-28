<?php

use App\Model\ChatRoom;
use App\Model\User;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
 */

Route::get('/log-me/{id}', function ($id) {
    return auth()->loginUsingId($id);
});
Route::get('/', function () {
    return view('welcome');
})->middleware("auth");

Route::prefix('api')->group(function () {

    Route::prefix('messages')->group(function () {
        Route::get("/", "Chat\ChatController@index");
        Route::post("/", "Chat\ChatController@store");
    });

    Route::prefix('attachments')->group(function () {
        Route::post("/", "Chat\ChatAttachmentController@store");
    });

    Route::prefix('users')->group(function () {
        Route::get("/", "User\UserController@index");
    });

}); /*API*/

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
// .............

Route::get("api/chatroom/{receiverId}", function ($receiverId) {

    $receiver     = User::find($receiverId);
    $roomType     = 'private';
    $senderUserId = user()->id;
    $roomMembers  = [$receiver->id, $senderUserId];
    sort($roomMembers);
    $json     = "'" . json_encode($roomMembers) . "'";
    $chatRoom = ChatRoom::whereRaw("JSON_CONTAINS(user_ids,{$json})")
        ->where("room_type", $roomType)
        ->first();
    if (is_null($chatRoom)) {
        $chatRoom            = new ChatRoom;
        $chatRoom->room_type = $roomType;
        $chatRoom->user_ids  = $roomMembers;
        $chatRoom->save();
    }
    return $chatRoom;
});
