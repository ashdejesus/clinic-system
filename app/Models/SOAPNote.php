<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SOAPNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'subjective',
        'objective',
        'assessment',
        'plan',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
