const db = require("../db/pool");

const TASK_COLUMNS = `
  id,
  title,
  description,
  due_date AS "dueDate",
  priority,
  status
`;

const VALID_STATUSES = new Set(["Pending", "Completed"]);

function normalizeStatusFilter(status) {
  if (!status || status === "All") {
    return null;
  }

  if (!VALID_STATUSES.has(status)) {
    throw new Error("Invalid task status filter");
  }

  return status;
}

async function createTask(task) {
  const { title, description = null, dueDate = null, priority = null, status = "Pending" } = task;

  const result = await db.query(
    `
      INSERT INTO tasks (title, description, due_date, priority, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING ${TASK_COLUMNS}
    `,
    [title, description, dueDate, priority, status]
  );

  return result.rows[0];
}

async function listTasks(statusFilter = "All") {
  const status = normalizeStatusFilter(statusFilter);
  const params = [];
  let whereClause = "";

  if (status) {
    params.push(status);
    whereClause = "WHERE status = $1";
  }

  const result = await db.query(
    `
      SELECT ${TASK_COLUMNS}
      FROM tasks
      ${whereClause}
      ORDER BY id ASC
    `,
    params
  );

  return result.rows;
}

async function getTaskById(id) {
  const result = await db.query(
    `
      SELECT ${TASK_COLUMNS}
      FROM tasks
      WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
}

async function updateTask(id, task) {
  const { title, description = null, dueDate = null, priority = null, status } = task;

  const result = await db.query(
    `
      UPDATE tasks
      SET
        title = $2,
        description = $3,
        due_date = $4,
        priority = $5,
        status = $6,
        updated_at = NOW()
      WHERE id = $1
      RETURNING ${TASK_COLUMNS}
    `,
    [id, title, description, dueDate, priority, status]
  );

  return result.rows[0] || null;
}

async function completeTask(id) {
  const result = await db.query(
    `
      UPDATE tasks
      SET
        status = 'Completed',
        updated_at = NOW()
      WHERE id = $1
      RETURNING ${TASK_COLUMNS}
    `,
    [id]
  );

  return result.rows[0] || null;
}

async function deleteTask(id) {
  const result = await db.query(
    `
      DELETE FROM tasks
      WHERE id = $1
      RETURNING ${TASK_COLUMNS}
    `,
    [id]
  );

  return result.rows[0] || null;
}

module.exports = {
  createTask,
  listTasks,
  getTaskById,
  updateTask,
  completeTask,
  deleteTask
};
