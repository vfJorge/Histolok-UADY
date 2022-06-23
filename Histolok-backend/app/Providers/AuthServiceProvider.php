<?php

namespace App\Providers;

use App\Models\Foto;
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
    }
}
