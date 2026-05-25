const emptyForm = {
  title: "",
  content: "",
  timeline: "",
};

const NoteForm = ({
  formValue,
  setFormValue,
  onSubmit,
  onHotkeySubmit,
  onCancelEdit,
  editingId,
  selectedNote,
  fieldErrors,
  error,
  isSubmitting,
}) => {
  const submitLabel = editingId ? "Update Note" : "Create Note";

  const handleTextareaKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter" && onHotkeySubmit) {
      event.preventDefault();
      onHotkeySubmit();
    }
  };

  return (
    <form className="note-form" onSubmit={onSubmit} noValidate>
      <div className="section-heading">
        <h2>{editingId ? "Edit note" : "Add a note"}</h2>
        <p>Capture a thought, task, or timeline update. Press Enter on inputs or Ctrl+Enter in content.</p>
      </div>

      <label>
        Title
        <input
          value={formValue.title}
          onChange={(event) => setFormValue({ ...formValue, title: event.target.value })}
          placeholder="Morning plan"
          aria-invalid={Boolean(fieldErrors?.title)}
          aria-describedby={fieldErrors?.title ? "note-title-error" : undefined}
          required
        />
        {fieldErrors?.title ? (
          <span className="field-error" id="note-title-error">
            {fieldErrors.title}
          </span>
        ) : null}
      </label>

      <label>
        Content
        <textarea
          value={formValue.content}
          onChange={(event) => setFormValue({ ...formValue, content: event.target.value })}
          placeholder="Write the main note content here..."
          rows="7"
          aria-invalid={Boolean(fieldErrors?.content)}
          aria-describedby={fieldErrors?.content ? "note-content-error" : undefined}
          onKeyDown={handleTextareaKeyDown}
          required
        />
        {fieldErrors?.content ? (
          <span className="field-error" id="note-content-error">
            {fieldErrors.content}
          </span>
        ) : null}
      </label>

      <label>
        Timeline
        <input
          type="date"
          value={formValue.timeline}
          onChange={(event) => setFormValue({ ...formValue, timeline: event.target.value })}
          aria-invalid={Boolean(fieldErrors?.timeline)}
          aria-describedby={fieldErrors?.timeline ? "note-timeline-error" : undefined}
        />
        {fieldErrors?.timeline ? (
          <span className="field-error" id="note-timeline-error">
            {fieldErrors.timeline}
          </span>
        ) : null}
      </label>

      {selectedNote ? (
        <div className="note-form__preview">
          <strong>Selected note:</strong>
          <span>{selectedNote.title}</span>
        </div>
      ) : null}

      {error ? (
        <div className="form-error" role="alert" aria-live="polite">
          {error}
        </div>
      ) : null}

      <div className="note-form__actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
        {editingId ? (
          <button type="button" className="ghost" onClick={onCancelEdit}>
            Cancel edit
          </button>
        ) : null}
        <button type="button" className="ghost" onClick={() => setFormValue(emptyForm)}>
          Clear
        </button>
      </div>
    </form>
  );
};

export { NoteForm as default, emptyForm };
