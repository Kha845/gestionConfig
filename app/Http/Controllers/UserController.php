<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(User::with('role')->get());
    }

  

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validation des données utilisateur
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        // Création de l'utilisateur sans rôle (role_id sera null au départ)
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'user' => $user
        ], 201);
    }

    public function assignRole(Request $request, User $user)
    {
        // Validation des données (par exemple, pour vérifier que le rôle est valide)
        $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);
    
        // Attribution du rôle à l'utilisateur
        $user->role_id = $request->input('role_id');
        $user->save();
    
        return response()->json(['message' => 'Rôle assigné avec succès']);
    }
                public function revokeRole(User $user)
            {
                // Vérification que l'utilisateur a un rôle assigné
                if (!$user->role_id) {
                    return response()->json(['message' => 'L\'utilisateur n\'a aucun rôle à révoquer'], 400);
                }

                // Révocation du rôle
                $user->role_id = null;  // Ou assigner à un rôle par défaut, si nécessaire
                $user->save();

                return response()->json(['message' => 'Rôle révoqué avec succès']);
            }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
