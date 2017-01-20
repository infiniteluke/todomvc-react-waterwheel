export default (url, param) => {
  const re = new RegExp(`#.*[&]*${param}=([^&]+)(&|$)`);
  const  match = url.match(re);
  return (match ? match[1] : "");
}