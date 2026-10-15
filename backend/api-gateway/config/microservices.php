<?php

return [
    "user_service" => [
        "url" => env("USER_SERVICE_URL", "http://user-service:3000")
    ],
    "music_service" => [
        "url" => env("MUSIC_SERVICE_URL", "http://music-service:80")
    ]
];
