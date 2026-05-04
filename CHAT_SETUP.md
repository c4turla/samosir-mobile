# Setup Real-Time Chat dengan Laravel Reverb

## 1. Install Laravel Reverb

```bash
composer require laravel/reverb
php artisan reverb:install
```

## 2. Konfigurasi Broadcasting

### config/broadcasting.php
```php
'reverb' => [
    'driver' => 'reverb',
    'key' => env('REVERB_APP_KEY'),
    'secret' => env('REVERB_APP_SECRET'),
    'app_id' => env('REVERB_APP_ID'),
    'options' => [
        'host' => env('REVERB_HOST', '127.0.0.1'),
        'port' => env('REVERB_PORT', 8080),
        'scheme' => env('REVERB_SCHEME', 'http'),
        'useTLS' => env('REVERB_SCHEME', 'http') === 'https',
    ],
    'client_options' => [
        // Guzzle client options: https://docs.guzzlephp.org/en/stable/request-options.html
    ],
],
```

### .env (Backend)
```
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=my-app-id
REVERB_APP_KEY=my-app-key
REVERB_APP_SECRET=my-app-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http
```

## 3. Setup Message Event

### app/Events/MessageSent.php (sudah ada)
Pastikan event meng-extends `ShouldBroadcast`:

```php
<?php

namespace App\Events;

use App\Models\Message;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $sender;

    public function __construct(Message $message)
    {
        $this->message = $message;
        $this->sender = $message->sender;
    }

    public function broadcastOn()
    {
        return [
            new PrivateChannel('conversation.' . $this->message->conversation_id),
            new PrivateChannel('user.' . $this->message->receiver_id),
        ];
    }

    public function broadcastAs()
    {
        return 'MessageSent';
    }
}
```

## 4. Setup Authentication untuk Broadcasting

### routes/api.php
```php
Broadcast::routes(['middleware' => ['auth:sanctum']]);
```

### atau routes/channels.php
```php
Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    return \App\Models\Conversation::where('id', $conversationId)
        ->whereHas('participants', function ($query) use ($user) {
            $query->where('users.id', $user->id);
        })->exists();
});

Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});
```

## 5. Jalankan Reverb Server

```bash
php artisan reverb:start
```

## 6. Update Frontend Environment

### .env (Frontend)
```
VITE_API_BASE=http://localhost:8004
VITE_REVERB_APP_KEY=my-app-key
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
```

## 7. Install Dependencies Frontend

```bash
npm install laravel-echo pusher-js
```

## 8. Test Real-Time Chat

1. Jalankan backend dengan `php artisan reverb:start`
2. Jalankan frontend dengan `npm run dev`
3. Buka 2 tab browser dengan user berbeda
4. Test kirim pesan - seharusnya langsung muncul tanpa refresh!

## ⚠️ **Fallback Mode (Polling)**

Jika WebSocket/Reverb belum dikonfigurasi atau gagal, sistem akan otomatis fallback ke **polling mode**:
- Conversations: Update setiap 10 detik
- Messages: Update setiap 5 detik
- UI akan tetap berfungsi, hanya saja tidak real-time (ada delay)

## Troubleshooting

### Error: "Pusher is not defined" / "require is not defined"
- Pastikan dependencies ter-install: `npm install laravel-echo pusher-js`
- Check import di Chat.vue - harus menggunakan:
  ```javascript
  import Pusher from 'pusher-js'
  window.Pusher = Pusher
  ```
- Bukan menggunakan `require()` karena ini browser environment

### Error: "WebSocket connection failed"
- Pastikan Reverb server running: `php artisan reverb:start`
- Check CORS settings di Laravel
- Verify REVERB_* environment variables
- Sistem akan otomatis fallback ke polling mode

### Error: "Authentication failed"
- Pastikan auth:sanctum middleware aktif
- Check token di localStorage
- Verify broadcasting auth routes

### Error: "Channel authorization failed"
- Check routes/channels.php configuration
- Ensure user has access to conversation/channel

### Info: "WebSocket disabled, using polling fallback"
- Ini normal jika Reverb belum setup
- Sistem akan menggunakan polling sebagai fallback
- Chat tetap berfungsi, hanya saja ada delay 5-10 detik