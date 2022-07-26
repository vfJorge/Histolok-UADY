<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator=$request->validate([
            'email'=>'required|string|email|max:100',
            'password'=>'required|string',
        ]);
         
        //Check email
        $user= User::where('email',$validator['email'])->first();
        //Check password
        if(!$user || !Hash::check($validator['password'],$user->password)){
            return response()->json(['message'=>'Bad credentials'],401);
        }
        $token = $user->createToken('PAT')->plainTextToken;//cambiar name

        return response()->json([
            'user'=>$user,
            'token'=>$token
        ],201);
    }

    /**
     * Get the authenticated User Type.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function type()
    {
        return response()->json(['type' => auth()->user()->type]);
    }
    

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request){
        $validator=Validator::make($request->all(),[
            'name'=>'required',
            'email'=>'required|string|email|max:100|unique:users',
            'password'=>'required|string|min:8|confirmed',
        ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(),400);
        }

        $user= User::create(array_merge(
            $validator->validate(),  
            ['password'=>bcrypt($request->password)]
        ));

        $token = $user->createToken('PAT')->plainTextToken;//cambiar name

        return response()->json([
            'message'=>'¡Usuario registrado exitosamente!',//borrar pq pa eso esta el status code
            'user'=>$user,
            'token'=>$token
        ],201);
    }

    public function logout(Request $request){
        auth()->user()->tokens()->delete();
        return ['message'=>'Logged out'];//cambiar a status code
    }
}