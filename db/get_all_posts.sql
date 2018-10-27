SELECT posts.*, users.display_name, users.profile_pic
FROM posts, users
WHERE posts.user_id = users.user_id