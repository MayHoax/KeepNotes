function NoteList({ notes }) {
  return (
    <div>
      {notes.map((note) => {
        return <NoteCard title={note.title} content={note.content} />;
      })}
    </div>
  );
}

export default NoteList;
