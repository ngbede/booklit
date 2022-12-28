// fetch the latest refresh token for a given user
export const fetchLatestRefreshToken = `
  SELECT
      u.id as user_id,
      u.email,
      r.token,
      r.created_at,
      r.updated_at
  FROM auth.users u
      LEFT JOIN auth.refresh_tokens r on u.id :: VARCHAR = r.user_id
  where
      u.email = $1
  ORDER BY r.created_at DESC
  LIMIT 1`

