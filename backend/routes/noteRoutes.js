import { Router } from "express";
import {
  createNewNote,
  deleteExistingNote,
  fetchNoteById,
  fetchNotes,
  updateExistingNote,
} from "../controllers/noteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.route("/").get(fetchNotes).post(createNewNote);
router.route("/:id").get(fetchNoteById).put(updateExistingNote).delete(deleteExistingNote);

export default router;
