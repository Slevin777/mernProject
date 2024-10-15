import notesController from '@/controllers/notes.controller';
import { Router } from 'express';

const NotesRoute = Router();
const path = '/notes';

NotesRoute.get(path, notesController.getAllNotes)
  .get(`${path}/:userId`, notesController.getNotesByUserId)
  .post(path, notesController.createNewNote)
  .patch(path, notesController.updateNote)
  .delete(path, notesController.deleteNote);

export default NotesRoute;
