import Note from "../models/Note.js";

const listNotesByUser = (userId) =>
  Note.find({ "author.userId": userId }).sort({ isPinned: -1, updatedAt: -1 });

const findNoteById = (noteId) => Note.findById(noteId);
const createNote = (noteData) => Note.create(noteData);
const updateNoteById = (noteId, updateData) =>
  Note.findByIdAndUpdate(noteId, updateData, {
    new: true,
    runValidators: true,
  });
const deleteNoteById = (noteId) => Note.findByIdAndDelete(noteId);

export {
  listNotesByUser,
  findNoteById,
  createNote,
  updateNoteById,
  deleteNoteById,
};
