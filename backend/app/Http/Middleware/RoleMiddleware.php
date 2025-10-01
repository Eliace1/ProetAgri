<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddlewareMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $role): Response
    {
        if(!auth("sanctum")->check()){
            abort(401);
        }
        //role admin
        if($role==='admin' && !auth("sanctum")->user()->admin){
            abort(403);
        }
        //role client
        if($role==='customer' && !auth("sanctum")->user()->customer){
            abort(403);
        }

        if($role === 'farmer' && !auth("sanctum")->user()->farmer){
            abort(403);
        }
        return $next($request);
    }
}
