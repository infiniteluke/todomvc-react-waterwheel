export default ({ id, attributes, relationships }) => ({
  id,
  completed: Boolean(Number(attributes.field_completed)),
  userId: relationships.uid.data.id,
  text: attributes.title,
  changed: attributes.changed,
  likes: attributes.likes || [],
  userLiked: attributes.userLiked || '',
})