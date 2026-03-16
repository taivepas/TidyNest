import { useCallback, useEffect, useState } from 'react';
import { createTask, deleteTask, getTasks, updateTask } from '../data/tasksApi';
import type { CreateTaskInput, TaskItem, UpdateTaskInput } from '../types/tasks';

type UseTasksDataState = {
  tasks: TaskItem[];
  isLoading: boolean;
  isSaving: boolean;
  error: Error | null;
};

const initialState: UseTasksDataState = {
  tasks: [],
  isLoading: true,
  isSaving: false,
  error: null,
};

export function useTasksData() {
  const [state, setState] = useState<UseTasksDataState>(initialState);

  const reload = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, error: null }));

    try {
      const tasks = await getTasks();
      setState((current) => ({
        ...current,
        tasks,
        isLoading: false,
        error: null,
      }));
    } catch (error: unknown) {
      const normalized = error instanceof Error ? error : new Error('Failed to load tasks.');
      setState((current) => ({ ...current, isLoading: false, error: normalized }));
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    void getTasks()
      .then((tasks) => {
        if (!isActive) return;
        setState((current) => ({
          ...current,
          tasks,
          isLoading: false,
          error: null,
        }));
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        const normalized = error instanceof Error ? error : new Error('Failed to load tasks.');
        setState((current) => ({ ...current, isLoading: false, error: normalized }));
      });

    return () => {
      isActive = false;
    };
  }, []);

  const create = useCallback(async (input: CreateTaskInput) => {
    setState((current) => ({ ...current, isSaving: true, error: null }));

    try {
      await createTask(input);
      const tasks = await getTasks();
      setState((current) => ({ ...current, tasks, isSaving: false, error: null }));
    } catch (error: unknown) {
      const normalized = error instanceof Error ? error : new Error('Failed to create task.');
      setState((current) => ({ ...current, isSaving: false, error: normalized }));
    }
  }, []);

  const update = useCallback(async (id: number, input: UpdateTaskInput) => {
    setState((current) => ({ ...current, isSaving: true, error: null }));

    try {
      await updateTask(id, input);
      const tasks = await getTasks();
      setState((current) => ({ ...current, tasks, isSaving: false, error: null }));
    } catch (error: unknown) {
      const normalized = error instanceof Error ? error : new Error('Failed to update task.');
      setState((current) => ({ ...current, isSaving: false, error: normalized }));
    }
  }, []);

  const remove = useCallback(async (id: number) => {
    setState((current) => ({ ...current, isSaving: true, error: null }));

    try {
      await deleteTask(id);
      const tasks = await getTasks();
      setState((current) => ({ ...current, tasks, isSaving: false, error: null }));
    } catch (error: unknown) {
      const normalized = error instanceof Error ? error : new Error('Failed to delete task.');
      setState((current) => ({ ...current, isSaving: false, error: normalized }));
    }
  }, []);

  return {
    ...state,
    reload,
    create,
    update,
    remove,
  };
}
