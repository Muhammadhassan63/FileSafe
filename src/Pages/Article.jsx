import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../utils/firebase";

const Article = () => {
  const [articles, setArticles] = useState([]);

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteDoc(doc(db, "Articles", id));
        toast.success("Article Deleted successfully", {
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

  return (
    <div className="container mx-auto my-8">
      {articles.map(({ id, story }) => (
        <div key={id} className="bg-white border rounded-md p-4 mb-4 shadow-lg">
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
      ))}
    </div>
  );
};

export default Article;
