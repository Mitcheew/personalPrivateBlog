UPDATE users
SET email = $2, password = $3, profile_pic = $4, display_name = $5
WHERE user_id = $1
RETURNING *