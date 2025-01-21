<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SOAPNote extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'subjective', 'objective', 'assessment', 'plan'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
