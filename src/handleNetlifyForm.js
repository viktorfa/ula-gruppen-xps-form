export const encode = (data, firstField = "name") => {
  const sortedFields = Object.entries(data).map(([key, value]) => ({
    key,
    value: value.name ? value.name : value,
  }));
  sortedFields.sort(
    (a, b) => (a.key === firstField && -1) || (b.key === firstField && 1) || 0,
  );
  return sortedFields
    .map(
      ({ key, value }) =>
        encodeURIComponent(key) + "=" + encodeURIComponent(value),
    )
    .join("&");
};

export const getSubject = formData => {
  return `${formData["form-name"]}: ${formData.name} ${formData.packages}pkg ${
    formData.productType.name
  } ${formData.location.name}`;
};

const handleForm = async (formName, state) => {
  const formData = {
    "form-name": formName,
    ...state,
  };
  const subject = getSubject(formData);
  return fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encode({
      ...formData,
      subject,
    }),
  });
};

export default handleForm;
