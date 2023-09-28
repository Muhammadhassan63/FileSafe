import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc
} from "firebase/firestore";
import { ref,deleteObject } from "firebase/storage";
import { toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db,storage } from "../utils/firebase";

const Blogs = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const articleRef = collection(db, "Blog");
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

  const handleDelete = async (id,fileName) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
        try {
          
          
          const desertRef = ref(storage, `files/${fileName}`);
          await deleteObject(desertRef)
          await deleteDoc(doc(db, "Blog", id));
          toast.success("Data Deleted successfully",{
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
      <h2 className="text-3xl font-bold mb-4 text-center">Your Data</h2>
      {articles.length === 0 ? (
        <p className="text-center text-xl">No articles found!</p>
      ) : (
        articles.map(
          ({ id, title, description, fileName, createdAt, downloadURL }) => (
            <div
              key={id}
              className="bg-white border rounded-md p-4 mb-4 shadow-lg"
            >
              <div className="flex items-center">
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mt-2 text-indigo-600">
                    {title}
                  </h3>
                  <p className="mt-2 text-gray-700 text-lg">
                    <b>Description:</b> {description}
                  </p>
                  <p className="text-gray-700 text-lg">
                    <b>Data:</b> {fileName}
                  </p>

                  <p className="text-sm text-gray-500">
                    {createdAt.toDate().toDateString()}
                  </p>

                  <div className="mt-4 space-x-4">
                    <button
                      onClick={() => handleDelete(id,fileName)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => window.open(downloadURL, "_blank")}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        )
      )}
    </div>
  );
};

export default Blogs;
