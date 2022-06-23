<?php

namespace Database\Seeders;
use App\Models\User;
use App\Models\Palabclv;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        

        User::factory()->create([
             'name' => 'Test User',
             'email' => 'test@example.com',
        ]);

        $keyword1 = new Palabclv();
        $keyword1->keyword = "celula";
        $keyword1->save();

        $keyword2 = new Palabclv();
        $keyword2->keyword = "epitelio";
        $keyword2->save();

        $keyword3 = new Palabclv();
        $keyword3->keyword = "mitosis";
        $keyword3->save();
    }
}
