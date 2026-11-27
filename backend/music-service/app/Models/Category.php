<?php

use Illuminate\Database\Eloquent\Attributes\Fillable;
use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\HasMany;

#[Fillable(['name', 'slug'])]
class Category extends Model
{
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];


    public function music(): HasMany
    {
        /** @var HasMany $relation */
        $relation = $this->hasMany(Music::class, 'category_id');
        return $relation;
    }
}
