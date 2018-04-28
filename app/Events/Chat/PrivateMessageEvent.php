<?php

namespace App\Events\Chat;

use App\Model\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PrivateMessageEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $broadcastQueue = "chat-queue";

    public $message;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */

    public function broadcastOn()
    {
        info($this->message->chat_room_id);
        return new PrivateChannel(
            "private-chat-room-{$this->message->chat_room_id}"
        );
    }

    public function broadcastWith()
    {
        return [
            'name'          => $this->message->sender->name,
            "message"       => $this->message->message,
            "type"          => $this->message->type,
            "profile_image" => $this->message->sender->profile_thumbnail ?? "/images/if_user.png",
        ];
    }
}
