<?php

namespace Tests\Feature;

use App\Models\Client;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CreateRequestValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_high_priority_request_wo_due_date_return_expected_422(): void{
        $client = Client::create([
            'name' => "Test Klijent",
            'email' => "test@test.com"
        ]);

        $response = $this->postJson('/api/requests', ['client_id' => $client->id, 'title' => 'Vise od ne znam koliko karaktera', 'priority' => 'high']);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['due_date']);
        $this->assertDatabaseCount('requests', 0);
    }
}
