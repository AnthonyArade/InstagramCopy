<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ModerationLog extends Model
{
    use HasFactory;

    public $timestamps = true;

    protected $fillable = [
        'moderator_id',
        'action_type',
        'target_type',
        'target_id',
        'reason',
    ];

    // Relationships
    public function moderator()
    {
        return $this->belongsTo(User::class, 'moderator_id');
    }
}
