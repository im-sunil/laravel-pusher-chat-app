<?php

use Carbon\Carbon;
use Faker\Generator as Faker;

$emoji =
    [
    ":bowtie:",
    ":smile:",
    ":laughing:",
    ":blush:",
    ":smiley:",
    ":relaxed:",
    ":smirk:",
    ":heart_eyes:",
    ":kissing_heart:",
    ":kissing_closed_eyes:",
    ":flushed:",
    ":relieved:",
    ":satisfied:",
    ":grin:",
    ":wink:",
    ":stuck_out_tongue_winking_eye:",
    ":stuck_out_tongue_closed_eyes:",
    ":grinning:",
    ":kissing:",
    ":kissing_smiling_eyes:",
    ":stuck_out_tongue:",
    ":sleeping:",
    ":worried:",
    ":frowning:",
    ":anguished:",
    ":open_mouth:",
    ":grimacing:",
    ":confused:",
    ":hushed:",
    ":expressionless:",
    ":unamused:",
    ":sweat_smile:",
    ":sweat:",
    ":disappointed_relieved:",
    ":weary:",
    ":pensive:",
    ":disappointed:",
    ":confounded:",
    ":fearful:",
    ":cold_sweat:",
    ":persevere:",
    ":cry:",
    ":sob:",
    ":joy:",
];
$rand_keys = array_rand($emoji, 2);
$factory->define(App\Model\Message::class, function (Faker $faker) use ($emoji, $rand_keys) {
    return [
        "message"    =>
        $emoji[$rand_keys[0]] . " " .
        $faker->realText($faker->numberBetween(10, 20)) . " " .
        $emoji[$rand_keys[1]],
        "user_id"    => 1,
        "type"       => 1,
        "created_at" => Carbon::now(),
        "updated_at" => Carbon::now(),
    ];
});
