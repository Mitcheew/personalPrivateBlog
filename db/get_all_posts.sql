SELECT DISTINCT ON (posts.post_id) posts.*, users.display_name, users.profile_pic, photos.image
FROM posts, users, photos
WHERE posts.user_id = users.user_id and posts.post_id = photos.post_id
ORDER BY post_id DESC;