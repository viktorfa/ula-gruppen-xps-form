export const encode = data => {
  return Object.entries(data)
    .map(([key, value]) => ({ key, value: value.name ? value.name : value }))
    .map(
      ({ key, value }) =>
        encodeURIComponent(key) + "=" + encodeURIComponent(value),
    )
    .join("&");
};

const handleForm = async (formName, state) => {
  return fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encode({
      "form-name": formName,
      subject: "Bestilling XPS",
      ...state,
    }),
  });
};

export default handleForm;
