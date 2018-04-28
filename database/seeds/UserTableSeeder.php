<?php

use App\Model\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        Schema::disableForeignKeyConstraints();
        Model::unguard();
        User::truncate();
        User::insert([
            [
                "name"              => "Pragnesh",
                "email"             => "pragnesh@gmail.com",
                "password"          => bcrypt("secret"),
                "profile_thumbnail" => "/images/user.png",
            ],
            [
                "name"              => "Ravindra",
                "email"             => "ravindra@gmail.com",
                "password"          => bcrypt("secret"),
                "profile_thumbnail" => "/images/user.png",
            ],
        ]
        );
        Schema::enableForeignKeyConstraints();
        // factory(App\Model\User::class, 10)->create();

    }
}
