<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Http\UploadedFile;

class MessageSendTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    /** @test*/
    public function can_user_send_message_and_attachment()
    {
        auth()->loginUsingId(1);
        $response = $this->json('POST', '/api/messages', [
            'send_attachment' => UploadedFile::fake()->image('avatar.png'),
        ]);
        $response->assertStatus(200);
    }
}
