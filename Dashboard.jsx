import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import AddBookForm from "../components/AddBookForm";
import BookTable from "../components/BookTable";
import { fetchBooksAPI, deleteBookAPI, submitBookAPI } from "../services/bookService";

function Dashboard() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [books, setBooks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publishedYear: "",
    genre: "",
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");

  const fetchBooks = async (pageNum = 1) => {
    try {
      const data = await fetchBooksAPI(token, pageNum, limit);
      setBooks(data.books);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (error) {
      console.error("Failed to fetch books", error);
    }
  };

  const handleEditBook = (book) => {
    setFormData(book);
    setIsEditing(true);
    setShowAddForm(true);
  };

  const handleSubmitBook = async (e) => {
    e.preventDefault();
    try {
      await submitBookAPI(token, formData, isEditing);
      resetForm();
      fetchBooks(page);
    } catch (error) {
      alert(error)
      resetForm();
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await deleteBookAPI(token, id);
      fetchBooks(page);
    } catch (error) {
      console.error("Failed to delete book", error);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", author: "", publishedYear: "", genre: "" });
    setIsEditing(false);
    setShowAddForm(false);
  };

  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-100 to-white">
      <Sidebar onAddClick={() => setShowAddForm(!showAddForm)} />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-6 overflow: hidden">
          Welcome to your <span className="text-gray-800">Dashboard</span>
        </h1>

        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <AddBookForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmitBook}
              isEditing={isEditing}
            />
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow-md">
          <BookTable
            books={books}
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
          />
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            Prev
          </button>
          <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
