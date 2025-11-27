import { useEffect, useState } from "react";
import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { toast, Toaster } from "react-hot-toast";
import { useDebounce } from "use-debounce";
import fetchNotes from "../../services/noteService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

function App() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debounceValue] = useDebounce(search, 1000);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data, isLoading, isFetching, isError, isSuccess } = useQuery({
    queryKey: ["notes", debounceValue, currentPage],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: 12,
        search: debounceValue,
      }),
    placeholderData: keepPreviousData,
  });
  useEffect(() => {
    if (isSuccess && debounceValue.trim() !== "" && data?.notes.length === 0) {
      toast.error("No notes found for your request.");
    }
  }, [isSuccess, data, debounceValue]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {
          <SearchBox
            onChange={(value) => {
              setSearch(value);
              setCurrentPage(1);
            }}
          />
        }

        {isError && <ErrorMessage />}

        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {isError && <p>Error loading notes</p>}
      {(isLoading || isFetching) && <Loader />}
      {data && <NoteList notes={data.notes} />}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <NoteForm onClose={closeModal} />
      </Modal>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
