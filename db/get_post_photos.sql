SELECT photos.image, photos.photo_id
FROM photos
WHERE post_id = $1