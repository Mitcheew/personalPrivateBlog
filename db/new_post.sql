INSERT INTO posts (title, published, content, user_id, post_date)
VALUES($1, $2, $3, $4, $5)
RETURNING posts.post_id;