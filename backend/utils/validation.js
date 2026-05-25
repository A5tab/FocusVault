import mongoose from "mongoose";

const createValidationError = (message, details = []) => {
  const error = new Error(message);
  error.statusCode = 400;
  if (details.length > 0) {
    error.details = details;
  }
  return error;
};

const trimText = (value) => (typeof value === "string" ? value.trim() : "");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const assertObjectId = (value, label = "id") => {
  if (!mongoose.isValidObjectId(value)) {
    throw createValidationError(`Invalid ${label}`);
  }
};

const validateSignupInput = ({ name, email, password }) => {
  const cleaned = {
    name: trimText(name),
    email: trimText(email).toLowerCase(),
    password: typeof password === "string" ? password : "",
  };

  const details = [];

  if (cleaned.name.length < 2) details.push("Name must be at least 2 characters long");
  if (!isValidEmail(cleaned.email)) details.push("Enter a valid email address");
  if (cleaned.password.length < 8) details.push("Password must be at least 8 characters long");

  if (details.length > 0) {
    throw createValidationError("Please fix the highlighted sign up fields", details);
  }

  return cleaned;
};

const validateLoginInput = ({ email, password }) => {
  const cleaned = {
    email: trimText(email).toLowerCase(),
    password: typeof password === "string" ? password : "",
  };

  const details = [];

  if (!isValidEmail(cleaned.email)) details.push("Enter a valid email address");
  if (!cleaned.password) details.push("Password is required");

  if (details.length > 0) {
    throw createValidationError("Please fix the highlighted login fields", details);
  }

  return cleaned;
};

const validateNoteInput = ({ title, content, timeline }, { partial = false } = {}) => {
  const cleaned = {};
  const details = [];

  if (title !== undefined) {
    const nextTitle = trimText(title);
    cleaned.title = nextTitle;
    if (!partial || nextTitle) {
      if (nextTitle.length < 3) details.push("Title must be at least 3 characters long");
      if (nextTitle.length > 120) details.push("Title must be 120 characters or fewer");
    }
  } else if (!partial) {
    details.push("Title is required");
  }

  if (content !== undefined) {
    const nextContent = trimText(content);
    cleaned.content = nextContent;
    if (!partial || nextContent) {
      if (nextContent.length < 10) details.push("Content must be at least 10 characters long");
      if (nextContent.length > 5000) details.push("Content must be 5000 characters or fewer");
    }
  } else if (!partial) {
    details.push("Content is required");
  }

  if (timeline !== undefined && timeline !== "") {
    const nextTimeline = new Date(timeline);
    if (Number.isNaN(nextTimeline.getTime())) {
      details.push("Timeline must be a valid date");
    } else {
      cleaned.timeline = nextTimeline;
    }
  }

  if (details.length > 0) {
    throw createValidationError("Please fix the highlighted note fields", details);
  }

  return cleaned;
};

export {
  assertObjectId,
  createValidationError,
  validateLoginInput,
  validateNoteInput,
  validateSignupInput,
};