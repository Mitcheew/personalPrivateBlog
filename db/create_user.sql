INSERT INTO users
(email, password, profile_pic, isadmin, approved, display_name)
VALUES
($1, $2, $3, $4, $5, $6)
RETURNING *;