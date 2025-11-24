import axios from "axios";
import type { Note } from "../types/note";

axios.defaults.baseURL = `https://notehub-public.goit.study/api`;

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}
export interface FetchNotesResponse {
  notes: Note[];
  page: number;
  total: number;
  totalPages: number;
}

// інтерфейс параметрів для створення нотатки
export interface CreateNoteParams {
  title: string;
  content?: string;
  tag: Note["tag"];
}

export default async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  try {
    const { data } = await axios.get<FetchNotesResponse>(`/notes`, {
      params: {
        page: params.page,
        perPage: params.perPage,
        search: params.search,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
      },
    });
    // 👇 тут ти побачиш, що приходить
    console.log("FETCHED NOTES:", data);
    return data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error; // 👈 важливо для React Query
  }
}

export async function createNote(note: CreateNoteParams): Promise<Note> {
  try {
    const { data } = await axios.post<Note>("/notes", note, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
      },
    });
    console.log("CREATED NOTE:", data);
    return data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
}

export async function deleteNote(id: string): Promise<void> {
  try {
    await axios.delete(`/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
      },
    });
    console.log("DELETED NOTE:", id);
  } catch (error) {
    console.error("Error delete note:", error);
    throw error;
  }
}
