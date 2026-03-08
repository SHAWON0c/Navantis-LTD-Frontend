const apiMessage = (res) => {
  if (!res) return "Something went wrong";

  // backend standard message
  if (res?.data?.message) return res.data.message;

  // validation error array
  if (res?.data?.errors?.length) return res.data.errors[0].message;

  // express error
  if (res?.error) return res.error;

  // fallback
  if (res?.message) return res.message;

  return "Operation failed";
};

export default apiMessage;