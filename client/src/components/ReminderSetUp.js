function ReminderForm({ userId }) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [time, setTime] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const fcmToken = await getFcmToken();
  
      await addDoc(collection(db, "users", userId, "reminders"), {
        title,
        body,
        time,
        repeat: "daily",
        fcmToken,
        createdAt: serverTimestamp()
      });
  
      setTitle('');
      setBody('');
      setTime('');
    };
  
    return (
      <form onSubmit={handleSubmit} className="reminder-form">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Reminder Title" required />
        <input value={body} onChange={e => setBody(e.target.value)} placeholder="Reminder Message" required />
        <input type="time" value={time} onChange={e => setTime(e.target.value)} required />
        <button type="submit">Add Reminder</button>
      </form>
    );
  }
  