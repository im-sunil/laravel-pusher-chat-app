<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMessagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // 1 -> simple text
        // 2 -> image
        // 3 -> attachment  other file
        Schema::create('messages', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string("message")->nullable();
            $table->json("document")->nullable();
            $table->tinyInteger("type")->nullable();
            $table->bigInteger("user_id")->nullable();
            $table->bigInteger('chat_room_id')->nullable()
                ->references('id')->on('chat_rooms');
            $table->timestamps();
            $table->softDeletes();
/*
$table->foreign('user_id')
->references('id')
->on('users')
->onUpdate('cascade')
->onDelete('cascade');*/
            $table->index(["message", "chat_room_id", "user_id", "updated_at"]);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('messages');
    }
}
