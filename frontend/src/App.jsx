function App() {
  return (
    <main style={styles.page}>
      <section style={styles.shell} aria-labelledby="app-title">
        <p style={styles.eyebrow}>Simple Task Manager</p>
        <h1 id="app-title" style={styles.heading}>
          Task dashboard foundation
        </h1>
        <p style={styles.copy}>
          The React app shell is ready for the upcoming task dashboard work.
        </p>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    margin: 0,
    display: 'grid',
    placeItems: 'center',
    background: '#f6f7fb',
    color: '#172033',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: '24px',
    boxSizing: 'border-box',
  },
  shell: {
    width: 'min(100%, 680px)',
    border: '1px solid #d9deea',
    borderRadius: '8px',
    background: '#ffffff',
    padding: '32px',
    boxShadow: '0 16px 40px rgba(23, 32, 51, 0.08)',
  },
  eyebrow: {
    margin: '0 0 12px',
    fontSize: '0.82rem',
    fontWeight: 700,
    letterSpacing: '0',
    textTransform: 'uppercase',
    color: '#3f6fd8',
  },
  heading: {
    margin: '0 0 12px',
    fontSize: 'clamp(2rem, 8vw, 3rem)',
    lineHeight: 1.05,
  },
  copy: {
    margin: 0,
    maxWidth: '48rem',
    color: '#526071',
    fontSize: '1.05rem',
    lineHeight: 1.6,
  },
};

export default App;
