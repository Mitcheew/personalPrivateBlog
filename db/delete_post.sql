DELETE FROM photos
WHERE post_id = $1;

DELETE FROM posts
WHERE post_id = $1