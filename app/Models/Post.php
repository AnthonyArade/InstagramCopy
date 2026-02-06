<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'image_url',
        'caption',
    ];

    protected $appends = ['likes_count', 'comments_count'];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // Accessors
    public function getLikesCountAttribute()
    {
        return $this->likes->count();
    }

    public function getCommentsCountAttribute()
    {
        return $this->comments->count();
    }
}
