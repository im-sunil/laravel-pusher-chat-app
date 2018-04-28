<?php

namespace App\Events\Chat;

use App\Model\Message;
use App\Model\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $broadcastQueue = "chat-queue";

    public $message;
    public $user;
    public $toId;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Message $message, User $user, $toId)
    {

        $this->message = $message;
        $this->user    = $user;
        $this->toId    = $toId;

    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */

    public function broadcastOn()
    {
        /* info("chat-{$this->user->id}-{$this->toId}");
        return new PrivateChannel("chat-{$this->user->id}-{$this->toId}");*/
        return new PrivateChannel('private-chat-room-' . $this->message->chat_room_id);
    }

    public function broadcastWith()
    {
        return [
            'name'          => $this->user->name,
            "message"       => $this->message->message,
            "type"          => $this->message->type,
            "profile_image" => $this->user->profile_thumbnail,
            "to_id"         => $this->toId,
        ];
    }

}
