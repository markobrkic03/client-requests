<?php

namespace App\Http\Controllers;

use App\Models\ClientRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class ClientRequestController extends Controller
{
    public function index(Request $request){
        $requests = ClientRequest::with('client:id,name')
            ->when($request->query('client_id'), function($query, $clientId){
            $query->where('client_id', $clientId);
            })
            ->when($request->query('status'), function($query, $status){
                $query->where('status', $status);
            })
            ->when($request->query('priority'), function($query, $priority){
                $query->where('priority', $priority);
            })
            ->when($request->query('q'), function ($query, $q) {
                $query->where('title', "ILIKE", "%$q%");
            })
            ->orderByDesc('id')
            ->get();

        return $requests;
    }
}
