const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");

const getApiErrorMessage = (error, fallbackMessage) => {
  const response = error?.response?.data;

  if (Array.isArray(response?.details) && response.details.length > 0) {
    return response.details[0];
  }

  return response?.message || fallbackMessage;
};

const validateLoginInput = ({ email, password }) => {
  const errors = {};
  const nextEmail = normalizeText(email).toLowerCase();
  const nextPassword = typeof password === "string" ? password : "";

  if (!nextEmail) {
    errors.email = "Email is required";
  } else if (!emailPattern.test(nextEmail)) {
    errors.email = "Enter a valid email address";
  }

  if (!nextPassword) {
    errors.password = "Password is required";
  }

  return errors;
};

const validateSignupInput = ({ name, email, password }) => {
  const errors = {};
  const nextName = normalizeText(name);
  const nextEmail = normalizeText(email).toLowerCase();
  const nextPassword = typeof password === "string" ? password : "";

  if (nextName.length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!nextEmail) {
    errors.email = "Email is required";
  } else if (!emailPattern.test(nextEmail)) {
    errors.email = "Enter a valid email address";
  }

  if (nextPassword.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return errors;
};

const validateNoteInput = ({ title, content, timeline }) => {
  const errors = {};
  const nextTitle = normalizeText(title);
  const nextContent = normalizeText(content);
  const nextTimeline = normalizeText(timeline);

  if (nextTitle.length < 3) {
    errors.title = "Title must be at least 3 characters";
  } else if (nextTitle.length > 120) {
    errors.title = "Title must be 120 characters or fewer";
  }

  if (nextContent.length < 10) {
    errors.content = "Content must be at least 10 characters";
  } else if (nextContent.length > 5000) {
    errors.content = "Content must be 5000 characters or fewer";
  }

  if (nextTimeline) {
    const parsedDate = new Date(nextTimeline);
    if (Number.isNaN(parsedDate.getTime())) {
      errors.timeline = "Timeline must be a valid date";
    }
  }

  return errors;
};

export {
  getApiErrorMessage,
  validateLoginInput,
  validateNoteInput,
  validateSignupInput,
};