import { useEffect, useMemo, useState } from "react";
import client from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import NoteCard from "../components/NoteCard.jsx";
import NoteForm, { emptyForm } from "../components/NoteForm.jsx";
import { getApiErrorMessage, validateNoteInput } from "../utils/validation.js";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [formValue, setFormValue] = useState(emptyForm);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setLoadError("");
      const { data } = await client.get("/notes");
      setNotes(data);
    } catch (requestError) {
      setLoadError(getApiErrorMessage(requestError, "Unable to load notes"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const sortedNotes = useMemo(
    () => [...notes].sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt)),
    [notes]
  );

  const latestNote = sortedNotes[0] || null;

  const filteredNotes = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return sortedNotes;
    }

    return sortedNotes.filter((note) => {
      const title = note.title?.toLowerCase() || "";
      const content = note.content?.toLowerCase() || "";
      const authorName = note.author?.name?.toLowerCase() || "";
      const authorEmail = note.author?.email?.toLowerCase() || "";

      return (
        title.includes(query) ||
        content.includes(query) ||
        authorName.includes(query) ||
        authorEmail.includes(query)
      );
    });
  }, [searchTerm, sortedNotes]);

  const handleSubmitNote = async () => {
    const nextErrors = validateNoteInput(formValue);
    setFieldErrors(nextErrors);
    setError("");
    setStatusMessage("");

    if (Object.keys(nextErrors).length > 0) {
      return false;
    }

    try {
      setIsSubmitting(true);

      if (editingId) {
        await client.put(`/notes/${editingId}`, formValue);
      } else {
        await client.post("/notes", formValue);
      }

      setFormValue(emptyForm);
      setEditingId("");
      setSelectedNote(null);
      setStatusMessage(editingId ? "Note updated successfully." : "Note created successfully.");
      await fetchNotes();
      return true;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to save note"));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handleSubmitNote();
  };

  const handleView = (note) => {
    setSelectedNote(note);
  };

  const handleEdit = (note) => {
    setSelectedNote(note);
    setEditingId(note._id);
    setFieldErrors({});
    setStatusMessage("");
    setFormValue({
      title: note.title,
      content: note.content,
      timeline: note.timeline ? new Date(note.timeline).toISOString().slice(0, 10) : "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId("");
    setSelectedNote(null);
    setFormValue(emptyForm);
    setFieldErrors({});
    setError("");
    setStatusMessage("");
  };

  const handleDelete = async (noteId) => {
    try {
      await client.delete(`/notes/${noteId}`);
      if (editingId === noteId) {
        setEditingId("");
        setFormValue(emptyForm);
        setSelectedNote(null);
      }
      await fetchNotes();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete note");
    }
  };

  const activeNote = selectedNote || sortedNotes[0] || null;

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <span className="brand-pill">FocusVault</span>
          <h1>Notes that stay organized.</h1>
          <p>
            Signed in as <strong>{user?.name}</strong>
          </p>
        </div>

        <div className="sidebar-card">
          <span className="sidebar-card__label">Workspace</span>
          <strong>{sortedNotes.length} saved notes</strong>
          <p>Fast create, clean review, and a focused reader panel.</p>
        </div>

        <button type="button" className="ghost sidebar-logout" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-grid">
        <section className="dashboard-hero">
          <div>
            <span className="eyebrow">Smart notes workspace</span>
            <h2>Capture ideas, track timelines, and keep them searchable.</h2>
          </div>
        </section>

        <section className="dashboard-stats" aria-label="Workspace summary">
          <article>
            <span>Total notes</span>
            <strong>{sortedNotes.length}</strong>
          </article>
          <article>
            <span>Editing mode</span>
            <strong>{editingId ? "Active" : "Idle"}</strong>
          </article>
          <article>
            <span>Latest update</span>
            <strong>{latestNote ? new Date(latestNote.updatedAt).toLocaleDateString() : "None yet"}</strong>
          </article>
        </section>

        <section className="workspace-grid">
          <NoteForm
            formValue={formValue}
            setFormValue={setFormValue}
            onSubmit={handleSubmit}
            onHotkeySubmit={handleSubmitNote}
            onCancelEdit={handleCancelEdit}
            editingId={editingId}
            selectedNote={selectedNote}
            fieldErrors={fieldErrors}
            error={error}
            isSubmitting={isSubmitting}
          />

          <section className="notes-panel">
            <div className="section-heading">
              <h2>Your notes</h2>
              <p>{sortedNotes.length} notes stored securely</p>
            </div>

            <div className="notes-toolbar">
              <label className="notes-search" htmlFor="notes-search-input">
                <span>Search notes</span>
                <input
                  id="notes-search-input"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search title, content, or author"
                />
              </label>
              <button
                type="button"
                className="ghost"
                onClick={() => setSearchTerm("")}
                disabled={!searchTerm}
              >
                Clear search
              </button>
            </div>

            {statusMessage ? (
              <div className="success-banner" role="status" aria-live="polite">
                {statusMessage}
              </div>
            ) : null}

            {loadError ? (
              <div className="empty-state empty-state--error" role="alert">
                <strong>Unable to load notes.</strong>
                <span>{loadError}</span>
                <button type="button" className="ghost" onClick={fetchNotes}>
                  Retry
                </button>
              </div>
            ) : null}

            {loading ? <div className="empty-state">Loading notes...</div> : null}

            <div className="notes-list">
              {!loading && !loadError
                ? filteredNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                : null}

              {!loading && !loadError && sortedNotes.length === 0 ? (
                <div className="empty-state">
                  No notes yet. Create the first one on the left.
                </div>
              ) : null}

              {!loading && !loadError && sortedNotes.length > 0 && filteredNotes.length === 0 ? (
                <div className="empty-state empty-state--error">
                  <strong>No notes match your search.</strong>
                  <span>Try a different keyword or clear the search field.</span>
                </div>
              ) : null}
            </div>
          </section>
        </section>

        <section className="reader-panel">
          <div className="section-heading">
            <h2>Reader</h2>
            <p>Quick preview of the active note</p>
          </div>

          {activeNote ? (
            <article className="reader-card">
              <div className="reader-card__meta">
                <span>{new Date(activeNote.timeline || activeNote.createdAt).toLocaleDateString()}</span>
                <span>{activeNote.author?.name}</span>
              </div>
              <h3>{activeNote.title}</h3>
              <p>{activeNote.content}</p>
              <footer>
                <span>{activeNote.author?.email}</span>
                <span>{activeNote.author?.name}</span>
              </footer>
            </article>
          ) : (
            <div className="empty-state">Select a note to view it here.</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
