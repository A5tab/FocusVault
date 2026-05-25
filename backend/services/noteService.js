import {
  createNote,
  deleteNoteById,
  findNoteById,
  listNotesByUser,
  updateNoteById,
} from "../repositories/noteRepository.js";
import { assertObjectId, validateNoteInput } from "../utils/validation.js";

const getNotes = async (userId) => listNotesByUser(userId);

const addNote = async (user, noteData) => {
  const cleaned = validateNoteInput(noteData);

  return createNote({
    ...cleaned,
    author: {
      userId: user.id,
      name: user.name,
      email: user.email,
    },
  });
};

const getNote = async (userId, noteId) => {
  assertObjectId(noteId, "note id");
  const note = await findNoteById(noteId);

  if (!note) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  if (note.author.userId.toString() !== userId.toString()) {
    const error = new Error("Not authorized to access this note");
    error.statusCode = 403;
    throw error;
  }

  return note;
};

const editNote = async (userId, noteId, updateData) => {
  assertObjectId(noteId, "note id");
  await getNote(userId, noteId);
  const cleaned = validateNoteInput(updateData, { partial: true });
  const nextUpdate = {
    ...cleaned,
  };

  if (typeof updateData.isPinned === "boolean") {
    nextUpdate.isPinned = updateData.isPinned;
  }

  const updatedNote = await updateNoteById(noteId, {
    ...nextUpdate,
    ...(nextUpdate.timeline ? { timeline: nextUpdate.timeline } : {}),
  });

  return updatedNote;
};

const removeNote = async (userId, noteId) => {
  assertObjectId(noteId, "note id");
  await getNote(userId, noteId);
  await deleteNoteById(noteId);
  return { message: "Note deleted successfully" };
};

export { getNotes, addNote, getNote, editNote, removeNote };
