<?php

return [
    'public_key_path' => env('JWT_PUBLIC_KEY_PATH', '/run/secrets/jwt_public_key'),
    'algo' => 'RS256',
    'cookie_name' => 'accessToken',
];
