# Dokumentasi API Chat V1 (Mobile)

Semua *endpoint* di bawah ini membutuhkan *authentication* menggunakan **Bearer Token** dari Laravel Sanctum.
Gunakan *header* berikut pada setiap *request*:
```http
Authorization: Bearer {token}
Accept: application/json
```

**Base URL**: `/api/v1`

---

## 1. Get Contacts (Daftar Pengguna)
Mengambil daftar semua pengguna aktif yang tersedia untuk diajak *chat*.

- **Endpoint**: `/chat/contacts`
- **Method**: `GET`
- **Response**:
```json
{
    "status": "success",
    "data": [
        {
            "id": 2,
            "name": "Budi Santoso",
            "role": "manager",
            "photo": "http://domain.com/storage/photos/budi.jpg"
        }
    ]
}
```

---

## 2. Get Conversations (Daftar Obrolan)
Mengambil daftar obrolan (riwayat *chat*) milik pengguna yang sedang *login*, diurutkan dari pesan terbaru.

- **Endpoint**: `/chat/conversations`
- **Method**: `GET`
- **Response**:
```json
{
    "status": "success",
    "data": [
        {
            "id": 1,
            "type": "private",
            "participant": {
                "id": 2,
                "name": "Budi Santoso",
                "role": "manager",
                "photo": "http://domain.com/storage/photos/budi.jpg"
            },
            "latest_message": {
                "body": "Halo, apa kabar?",
                "sender_id": 2,
                "sender_name": "Budi Santoso",
                "created_at": "2026-05-25T10:00:00.000000Z"
            },
            "last_message_at": "2026-05-25T10:00:00.000000Z",
            "read_at": "2026-05-25T10:05:00.000000Z"
        }
    ]
}
```

---

## 3. Get or Create Conversation (Inisiasi Obrolan)
Mendapatkan ID percakapan (*conversation*) yang sudah ada antara pengguna *login* dan *receiver*, atau membuat percakapan baru jika belum ada (tanpa harus mengirim pesan).

- **Endpoint**: `/chat/conversations/get`
- **Method**: `POST`
- **Body** (JSON/Form-Data):
  - `receiver_id` (integer, **required**): ID pengguna tujuan.
- **Response**:
```json
{
    "status": "success",
    "data": {
        "id": 1,
        "type": "private",
        "created_at": "...",
        "updated_at": "...",
        "participants": [...],
        "latest_message": null
    }
}
```

---

## 4. Get Messages (Riwayat Pesan dalam Obrolan)
Mengambil semua pesan di dalam satu *conversation*. Pemanggilan endpoint ini akan otomatis menandai obrolan tersebut telah dibaca (`read_at`).

- **Endpoint**: `/chat/conversations/{conversation_id}/messages`
- **Method**: `GET`
- **Query Parameters**:
  - `per_page` (integer, optional): Jumlah data per halaman, default: `50`.
  - `page` (integer, optional): Nomor halaman untuk paginasi.
- **Response**:
```json
{
    "status": "success",
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": 101,
                "conversation_id": 1,
                "sender_id": 2,
                "body": "Halo, apa kabar?",
                "type": "text",
                "file_url": null,
                "file_name": null,
                "file_type": null,
                "is_edited": false,
                "is_deleted": false,
                "created_at": "2026-05-25T10:00:00.000000Z",
                "file_full_url": null,
                "sender": {
                    "id": 2,
                    "name": "Budi Santoso",
                    "role": "manager",
                    "photo": "..."
                }
            }
        ],
        "last_page": 1,
        "total": 1
    }
}
```

---

## 5. Send Message (Kirim Pesan)
Mengirim pesan teks dan/atau dokumen/gambar ke dalam percakapan.

- **Endpoint**: `/chat/messages`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data` (Wajib jika ada *file upload*, jika tidak bisa menggunakan JSON).
- **Body Parameters**:
  - `conversation_id` (integer, *optional*): Jika kosong, maka `receiver_id` **wajib** diisi.
  - `receiver_id` (integer, *optional*): ID penerima. Jika `conversation_id` kosong, sistem akan otomatis mencari atau membuat obrolan baru dengan `receiver_id` ini.
  - `message` (string, *optional*): Teks pesan (wajib jika tidak melampirkan file).
  - `file` (file, *optional*): Lampiran file/gambar (Maksimal 10 MB).
- **Response**:
```json
{
    "status": "success",
    "message": "Pesan berhasil dikirim.",
    "data": {
        "id": 102,
        "conversation_id": 1,
        "sender_id": 1,
        "body": "Baik, terima kasih laporannya.",
        "type": "image",
        "file_url": "chat/xxx.jpg",
        "file_name": "laporan.jpg",
        "file_type": "image/jpeg",
        "created_at": "2026-05-25T10:05:00.000000Z",
        "file_full_url": "http://domain.com/storage/chat/xxx.jpg",
        "sender": {
            "id": 1,
            "name": "Admin Port",
            "role": "admin"
        }
    }
}
```

---

## 6. Update Message (Edit Pesan)
Mengubah isi teks pesan. Hanya bisa dilakukan oleh pengirim pesan tersebut.

- **Endpoint**: `/chat/messages/{message_id}`
- **Method**: `PUT`
- **Body** (JSON):
  - `body` (string, **required**): Teks baru pengganti teks lama.
- **Response**:
```json
{
    "status": "success",
    "message": "Pesan berhasil diubah",
    "data": {
        "id": 102,
        "body": "Teks yang sudah diedit",
        "is_edited": true,
        "...": "..."
    }
}
```

---

## 7. Delete Message (Hapus Pesan)
Menghapus sebuah pesan secara *soft-delete*. Pesan akan ditandai terhapus dan teksnya berubah menjadi "Pesan ini telah dihapus".

- **Endpoint**: `/chat/messages/{message_id}`
- **Method**: `DELETE`
- **Response**:
```json
{
    "status": "success",
    "message": "Pesan berhasil dihapus",
    "data": {
        "id": 102,
        "body": "Pesan ini telah dihapus",
        "is_deleted": true,
        "...": "..."
    }
}
```

---

## 8. Delete Conversation (Hapus Obrolan)
Menghapus seluruh percakapan beserta seluruh pesannya.

- **Endpoint**: `/chat/conversations/{conversation_id}`
- **Method**: `DELETE`
- **Response**:
```json
{
    "status": "success",
    "message": "Conversation deleted"
}
```

---

## 💡 Catatan Terkait Realtime (WebSockets)

Aplikasi *mobile* disarankan untuk mendengarkan (*listen*) via *WebSocket* (Pusher/Reverb) agar mendapat pembaruan pesan secara instan.

**Event yang disiarkan (Broadcasted Events):**
- `App\Events\MessageSent` : Ketika pesan baru masuk.
- `App\Events\MessageUpdated` : Ketika ada pesan diedit.
- `App\Events\MessageDeleted` : Ketika ada pesan ditarik/dihapus.
