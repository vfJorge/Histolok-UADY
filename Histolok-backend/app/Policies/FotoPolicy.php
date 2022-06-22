<?php

namespace App\Policies;

use App\Models\Foto;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FotoPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Post  $post
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function author(User $user, Foto $foto)
    {
        return $user->id === $foto->user_id;
    }

    
}
