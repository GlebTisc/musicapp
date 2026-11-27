<?php

use Illuminate\Database\Eloquent\Attributes\Fillable;
use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\BelongsTo;

#[Fillable(['category_id', 'title', 'artist', 'duration', 'file', 'cover', 'year'])]
class Music extends Model
{
    protected $casts = [
        'duration' => 'integer',
        'year' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function category(): BelongsTo
    {
        /** @var BelongsTo $relation */
        $relation = $this->belongsTo(Category::class, 'category_id');
        return $relation;
    }
}
