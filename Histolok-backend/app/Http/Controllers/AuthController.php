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
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum', ['except' => ['login','register','index']]);
    }
 
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
        $token = $user->createToken('myapptoken')->plainTextToken;//cambiar name

        return response()->json([
            'user'=>$user,
            'token'=>$token
        ],201);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user());
    }
    public function type()
    {
        return response()->json(['type' => auth()->user()->type]);
    }
    
   
    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
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

        $token = $user->createToken('myapptoken')->plainTextToken;//cambiar name

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