import asyncHandler from "../utils/asyncHandler.js";
import {
  addNote,
  editNote,
  getNote,
  getNotes,
  removeNote,
} from "../services/noteService.js";

const fetchNotes = asyncHandler(async (req, res) => {
  const notes = await getNotes(req.user.id);
  res.json(notes);
});

const fetchNoteById = asyncHandler(async (req, res) => {
  const note = await getNote(req.user.id, req.params.id);
  res.json(note);
});

const createNewNote = asyncHandler(async (req, res) => {
  let payload = {};

  if (req.body) {
    payload = req.body;
  }

  const note = await addNote(req.user, payload);
  res.status(201).json(note);
});

const updateExistingNote = asyncHandler(async (req, res) => {
  let payload = {};

  if (req.body) {
    payload = req.body;
  }

  const note = await editNote(req.user.id, req.params.id, payload);
  res.json(note);
});

const deleteExistingNote = asyncHandler(async (req, res) => {
  const result = await removeNote(req.user.id, req.params.id);
  res.json(result);
});

export {
  fetchNotes,
  fetchNoteById,
  createNewNote,
  updateExistingNote,
  deleteExistingNote,
};
