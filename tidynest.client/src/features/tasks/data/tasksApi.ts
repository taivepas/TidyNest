import type { CreateTaskInput, TaskItem, UpdateTaskInput } from '../types/tasks';

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Task API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getTasks(): Promise<TaskItem[]> {
  const response = await fetch('/api/tasks');
  return parseResponse<TaskItem[]>(response);
}

export async function createTask(input: CreateTaskInput): Promise<TaskItem> {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  return parseResponse<TaskItem>(response);
}

export async function updateTask(id: number, input: UpdateTaskInput): Promise<TaskItem> {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  return parseResponse<TaskItem>(response);
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Task API request failed: ${response.status}`);
  }
}
