<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $requests = Client::select('id', 'name')
            ->orderBy('name')
            ->get();
        return $requests;
    }
}
