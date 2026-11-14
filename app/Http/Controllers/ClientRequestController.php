<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequestRequest;
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

    public function summary(Request $request){
        $query = ClientRequest::selectRaw('status, count(*) as total')
            ->when($request->query('client_id'), function($query, $clientId){
                $query->where('client_id', $clientId);
            })
            ->groupBy('status');

//        dd($query->toSql(), $query->getBindings());
//        "select status, count(*) as total from "requests" group by "status"" // app\Http\Controllers\ClientRequestController.php:38
//        [] // app\Http\Controllers\ClientRequestController.php:38
//        "select status, count(*) as total from "requests" where "client_id" = ? group by "status"" // app\Http\Controllers\ClientRequestController.php:38
//array:1 [▼ // app\Http\Controllers\ClientRequestController.php:38
//  0 => "3"
//]


        $counts = $query->pluck('total', 'status');

        return [
            'open' => $counts['open'] ?? 0,
            'in_progress' => $counts['in_progress'] ?? 0,
            'done' => $counts['done'] ?? 0
        ];
    }


    public function store(StoreClientRequestRequest $request){

        $clientRequest = ClientRequest::create($request->validated());

        $clientRequest->refresh();
        $clientRequest->load('client:id,name');

        return response()->json($clientRequest, 201);

    }

}
