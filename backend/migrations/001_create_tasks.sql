CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  priority TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT tasks_title_not_empty CHECK (char_length(btrim(title)) > 0),
  CONSTRAINT tasks_status_valid CHECK (status IN ('Pending', 'Completed'))
);
