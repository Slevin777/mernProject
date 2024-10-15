import Note from '@/models/Note';
import { Note as INote } from '@interfaces/notesInterface';
import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

// @desc Get all notes
// @route GET /notes
// @access Private

const getAllNotes = expressAsyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const notes: INote[] = await Note.find().lean();

  if (!notes.length) {
    res.status(400).json({ message: 'No notes found' });
  } else {
    res.json(notes);
  }
});

// @desc Get notes by userId
// @route GET /notes
// @access Private

const getNotesByUserId = expressAsyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  const notes: INote[] = await Note.find({ user: userId }).lean();

  if (!notes.length) {
    res.status(400).json({ message: 'No notes found for this user' });
  } else {
    res.json(notes);
  }
});

// @desc Create new note
// @route POST /notes
// @access Private

const createNewNote = expressAsyncHandler(async (req: Request<{}, {}, INote>, res): Promise<void> => {
  const { text, title, user } = req.body;

  //Confirm data
  if (!text || !title || !user) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  //Create and store new note
  const note = await Note.create({ user, title, text });

  if (note) {
    res.status(201).json({ message: `New note ${title} created` });
  } else {
    res.status(400).json({ message: 'Invalid note data received' });
  }
});

// @desc Update a note
// @route PATCH /notes
// @access Private

const updateNote = expressAsyncHandler(async (req: Request<{}, {}, INote>, res): Promise<void> => {
  const { id, user, title, text, completed } = req.body;

  //Confirm data
  if (!id || !user || !title || !text || typeof completed !== 'boolean') {
    res.status(400).json({ message: 'All field are required' });
    return;
  }

  const note = await Note.findById(id).exec();
  if (!note) {
    res.status(400).json({ message: 'Note not found' });
    return;
  }

  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;

  await note.save();

  res.json({ message: `${title} updated` });
});

// @desc Delete a note
// @route DELETE /notes
// @access Private

const deleteNote = expressAsyncHandler(async (req, res): Promise<void> => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ message: 'Note ID is required' });
    return;
  }

  const note = await Note.findById(id).exec();

  if (!note) {
    res.status(400).json({ message: 'User not found' });
    return;
  }

  await note.deleteOne();

  const reply = `Username ${note?.title} with ID ${note?._id} has been deleted`;

  res.json(reply);
});

export default {
  getAllNotes,
  getNotesByUserId,
  createNewNote,
  updateNote,
  deleteNote,
};
