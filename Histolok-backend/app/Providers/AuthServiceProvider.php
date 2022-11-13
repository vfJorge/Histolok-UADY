<?php

namespace App\Providers;

use App\Models\Foto;
use App\Models\Examen;
use App\Models\Pregunta;
use App\Models\User;
use App\Policies\FotoPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Foto::class => FotoPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Gate::define('crudAll-users', function (User $user) {
            return $user->type === "A";
        });
        Gate::define('delete-user', function (User $user,User $user2) {
            return in_array($user->type,["A","S"]) && $user2->type === "E";
        });

        Gate::define('author-users', function (User $user,User $user2) {
            return $user->id === $user2->id;
        });

        Gate::define('author-pregunta', function (User $user,Pregunta $pregunta) {
            return $user->id === $pregunta->user_id;
        });

        Gate::define('author-examen', function (User $user,Examen $examen) {
            return $user->id === $examen->user_id;
        });

        Gate::define('author-foto', function (User $user,Foto $foto) {
            return $user->id === $foto->user_id;
        });
        Gate::define('batalla-examen', function (User $user,Examen $examen) {
            return $examen->mode === "batalla";
        });
    }
}
