export default function successResponse(message, status = 500, success = false, data) {
  return { header:{message, status, success}, data };
}
