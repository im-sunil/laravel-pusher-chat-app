<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Controllers\Chat\ChatAttachmentController;

class FileUploadTest extends TestCase
{

    /** @test */
    public function is_image()
    {
        $attachment = new ChatAttachmentController;
        $php        = $attachment->isImage(public_path("index.php"));
        $json       = $attachment->isImage(public_path("mix-manifest.json"));
        $png        = $attachment->isImage(public_path("sheet_apple_64_indexed_256colors.png"));
        $this->assertFalse($php);
        $this->assertFalse($json);
        $this->assertTrue($png);
    }
}
