SELECT posts.*, users.display_name, users.profile_pic
FROM posts, users
WHERE posts.post_id = $1 AND posts.user_id = users.user_id