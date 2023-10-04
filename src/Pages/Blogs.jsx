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
import { db,storage } from "../utils/firebase";
import { ref,deleteObject } from "firebase/storage";


const Blogs = () => {
  const [allArticles, setAllArticles] = useState([]);

  useEffect(() => {
    const articleRef = collection(db, "Articles");
    const blogRef = collection(db, "Blog");

    const q = query(articleRef, orderBy("createdAt", "desc"));
    const blogQ = query(blogRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const articlesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        type: "text",
        ...doc.data(),
      }));

      const unsubscribeBlog = onSnapshot(blogQ, (blogSnapshot) => {
        const blogArticlesData = blogSnapshot.docs.map((doc) => ({
          id: doc.id,
          type: "multimedia",
          ...doc.data(),
        }));

        const combinedData = [...articlesData, ...blogArticlesData];
        const sortedData = combinedData.sort(
          (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
        );

        setAllArticles(sortedData);
      });
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id, fileName) => {
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
        toast.error("Error deleting article", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
        console.log(error);
      }
    }
  };

  const handleDeleteMultimedia = async (id,fileName) => {
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
      {allArticles.map(({ id, type, story, title, description, fileName, createdAt, downloadURL }) => (
        <div key={id} className="bg-white border rounded-md p-4 mb-4 shadow-lg">
          <div className="flex items-center">
            <div className="ml-4">
              {type === "text" ? (
                <h3 className="text-xl font-semibold mt-2 text-indigo-600">
                  {story}
                </h3>
              ) : (
                <><h3 className="text-xl font-semibold mt-2 text-indigo-600">
                    {title}
                  </h3><p className="mt-2 text-gray-700 text-lg">
                      <b>Description:</b> {description}
                    </p><p className="mt-2 text-gray-700 text-lg">
                      <b>Data:</b> {fileName}
                    </p></>
              )}
              

              <p className="text-sm text-gray-500">
                {createdAt.toDate().toDateString()}
              </p>

              <div className="mt-4 space-x-4">
              {type === "multimedia" ? (
            <button
              onClick={() => handleDeleteMultimedia(id, fileName)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          ) : (
            <button
              onClick={() => handleDelete(id, fileName)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          )}
                {type === "multimedia" && (
                  <button
                    onClick={() => window.open(downloadURL, "_blank")}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Download
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Blogs;
