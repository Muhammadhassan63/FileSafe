import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  deleteDoc,
  doc
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";

const Article = () => {
  const [textInput, setTextInput] = useState("");
  const [articles, setArticles] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    const articleRef = collection(db, "Articles");
    const q = query(articleRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const articlesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setArticles(articlesData);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleUploadClick = async () => {
    const articleRef = collection(db, "Articles");

    await addDoc(articleRef, {
      story: textInput,
      createdAt: Timestamp.now().toDate(),
    }).then(() => {
      toast.success("Article Added Successfully", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
      setTextInput("");
    });
  };

  const handleDelete = async (id,fileName) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
        try {
          
          await deleteDoc(doc(db, "Articles", id));
          toast.success("Article Deleted successfully",{
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "light",
            });
          
        } catch (error) {
          alert("Error deleting article");
          console.log(error);
        }
      }
  };

  const handleSignOut = async () => {
    localStorage.setItem("login", false);
    navigate("/signin");
  };

  return (
    
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />
      <button
        onClick={handleSignOut}
        className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 ml-auto mt-4 mr-4"
      >
        Sign Out
      </button>

      <h1 className="text-4xl font-semibold text-center py-4">
        FileSafe
      </h1>

      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
              <h2 className="text-2xl font-semibold mb-4">Story</h2>

              <div className="mb-4">
                <textarea
                  id="story"
                  name="story"
                  className="border border-gray-300 rounded px-3 h-32 py-2 w-full mb-4"
                  placeholder="Enter file description"
                  value={textInput}
                  onChange={handleInputChange}
                />
              </div>
              <button
                onClick={handleUploadClick}
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
              >
                Upload
              </button>
            </div>
          </div>
          <div className="container mx-auto my-8">
            <h2 className="text-3xl font-bold mb-4 text-center">Your Articles</h2>
            {articles.length === 0 ? (
              <p className="text-center text-xl">No articles found!</p>
            ) : (
              articles.map(({ id, story }) => (
                <div
                  key={id}
                  className="bg-white border rounded-md p-4 mb-4 shadow-lg"
                >
                  <div className="flex items-center">
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold mt-2 text-indigo-600">
                        {story}
                      </h3>
                      <button
                      onClick={() => handleDelete(id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4"
                    >
                      Delete
                    </button>

 
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
