# Video streaming platform 

---

### DB schema design

---

### **1. Users Table**
Stores user information and authentication data.

| Column           | Type          | Constraints                      |
|-------------------|---------------|-----------------------------------|
| `id`             | UUID          | Primary Key                      |
| `username`       | VARCHAR(255)  | Not Null                         |
| `email`          | VARCHAR(255)  | Unique, Not Null                 |
| `password`       | VARCHAR(255)  | Not Null                         |
| `avatar`         | TEXT          | Default: null                    |
| `created_at`     | TIMESTAMP     | Default: CURRENT_TIMESTAMP       |
| `updated_at`     | TIMESTAMP     | Default: CURRENT_TIMESTAMP       |

---

### **2. Videos Table**
Stores video metadata.

| Column           | Type          | Constraints                      |
|-------------------|---------------|-----------------------------------|
| `id`             | UUID          | Primary Key                      |
| `title`          | VARCHAR(255)  | Not Null                         |
| `description`    | TEXT          | Default: null                    |
| `video_url`      | TEXT          | Not Null                         |
| `thumbnail_url`  | TEXT          | Default: null                    |
| `user_id`        | UUID          | Foreign Key -> Users(id)         |
| `views`          | INT           | Default: 0                       |
| `created_at`     | TIMESTAMP     | Default: CURRENT_TIMESTAMP       |
| `updated_at`     | TIMESTAMP     | Default: CURRENT_TIMESTAMP       |

---

### **3. Comments Table**
Stores comments for videos.

| Column           | Type          | Constraints                      |
|-------------------|---------------|-----------------------------------|
| `id`             | UUID          | Primary Key                      |
| `text`           | TEXT          | Not Null                         |
| `user_id`        | UUID          | Foreign Key -> Users(id)         |
| `video_id`       | UUID          | Foreign Key -> Videos(id)        |
| `created_at`     | TIMESTAMP     | Default: CURRENT_TIMESTAMP       |

---

### **4. Likes Table**
Tracks likes and dislikes for videos.

| Column           | Type          | Constraints                      |
|-------------------|---------------|-----------------------------------|
| `id`             | UUID          | Primary Key                      |
| `user_id`        | UUID          | Foreign Key -> Users(id)         |
| `video_id`       | UUID          | Foreign Key -> Videos(id)        |
| `type`           | ENUM          | Values: ['like', 'dislike']      |
| `created_at`     | TIMESTAMP     | Default: CURRENT_TIMESTAMP       |

---

### **5. Subscriptions Table**
Tracks user subscriptions.

| Column           | Type          | Constraints                      |
|-------------------|---------------|-----------------------------------|
| `id`             | UUID          | Primary Key                      |
| `subscriber_id`  | UUID          | Foreign Key -> Users(id)         |
| `channel_id`     | UUID          | Foreign Key -> Users(id)         |
| `created_at`     | TIMESTAMP     | Default: CURRENT_TIMESTAMP       |

---

### **6. Playlists Table**
Stores playlists created by users.

| Column           | Type          | Constraints                      |
|-------------------|---------------|-----------------------------------|
| `id`             | UUID          | Primary Key                      |
| `name`           | VARCHAR(255)  | Not Null                         |
| `description`    | TEXT          | Default: null                    |
| `user_id`        | UUID          | Foreign Key -> Users(id)         |
| `created_at`     | TIMESTAMP     | Default: CURRENT_TIMESTAMP       |
| `updated_at`     | TIMESTAMP     | Default: CURRENT_TIMESTAMP       |

---

### **7. PlaylistVideos Table**
Associates videos with playlists.

| Column           | Type          | Constraints                      |
|-------------------|---------------|-----------------------------------|
| `id`             | UUID          | Primary Key                      |
| `playlist_id`    | UUID          | Foreign Key -> Playlists(id)     |
| `video_id`       | UUID          | Foreign Key -> Videos(id)        |
| `created_at`     | TIMESTAMP     | Default: CURRENT_TIMESTAMP       |

---

### **8. Views Table (Optional)**
Tracks views for analytics purposes.

| Column           | Type          | Constraints                      |
|-------------------|---------------|-----------------------------------|
| `id`             | UUID          | Primary Key                      |
| `video_id`       | UUID          | Foreign Key -> Videos(id)        |
| `user_id`        | UUID          | Foreign Key -> Users(id), Nullable (for anonymous views) |
| `viewed_at`      | TIMESTAMP     | Default: CURRENT_TIMESTAMP       |

---

### **Relationships**
1. **Users ↔ Videos**: One-to-Many (A user can upload multiple videos).
2. **Users ↔ Comments**: One-to-Many (A user can comment on multiple videos).
3. **Videos ↔ Comments**: One-to-Many (A video can have multiple comments).
4. **Videos ↔ Likes**: One-to-Many (A video can have multiple likes or dislikes).
5. **Users ↔ Subscriptions**: Many-to-Many (Users can subscribe to other users).
6. **Playlists ↔ Videos**: Many-to-Many (Videos can belong to multiple playlists).

---
