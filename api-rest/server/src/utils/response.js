export default function response(
  message,
  status = 500,
  success = false,
  data = undefined
) {
  return { header: { message, status, success }, data };
}
