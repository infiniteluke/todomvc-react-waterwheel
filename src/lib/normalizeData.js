export default ({ id, attributes }) => ({
  id,
  completed: Boolean(Number(attributes.field_completed)),
  text: attributes.title,
  changed: attributes.changed,
})