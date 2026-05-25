const NoteCard = ({ note, onView, onEdit, onDelete, onTogglePin }) => {
  return (
    <article className="note-card">
      <div className="note-card__top">
        <span className="note-card__date">
          {new Date(note.timeline || note.createdAt).toLocaleDateString()}
        </span>
        <div className="note-card__flags">
          {note.isPinned ? <span className="note-card__badge">Pinned</span> : null}
          <span className="note-card__author">{note.author?.name || "Unknown author"}</span>
        </div>
      </div>
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <div className="note-card__actions">
        <button type="button" onClick={() => onView(note)}>
          View
        </button>
        <button type="button" onClick={() => onEdit(note)}>
          Edit
        </button>
        <button type="button" className="ghost" onClick={() => onTogglePin(note)}>
          {note.isPinned ? "Unpin" : "Pin"}
        </button>
        <button type="button" className="danger" onClick={() => onDelete(note._id)}>
          Delete
        </button>
      </div>
    </article>
  );
};

export default NoteCard;
