<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientRequest extends Model
{
    protected $table = 'requests';

    protected $fillable = [
        'client_id',
        'title',
        'description',
        'status',
        'priority',
        'due_date',
        'resolution'
    ];

    protected function casts(): array{
        return[
            'due_date' => 'date:Y-m-d'
        ];
    }


    public function client(): BelongsTo{
        return $this->belongsTo(Client::class);
    }
}
