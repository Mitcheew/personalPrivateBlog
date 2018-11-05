UPDATE users
SET email = $2, profile_pic = $3, display_name = $4
WHERE user_id = $1
RETURNING *