import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { storage, db } from "../utils/firebase";
import Blogs from "./Blogs";
import { useNavigate } from "react-router-dom";

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [textInput, setTextInput] = useState("");

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  };


  const handleUploadClick = async () => {
    const storyRef = collection(db, "Articles");
    await addDoc(storyRef, {
      story: textInput,
      createdAt: Timestamp.now().toDate(),
    })
      .then(() => {
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
      })
      .catch((err) => {
        toast.error("There is an error uploading Aricle", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const handleUpload = () => {
    if (selectedFile) {
      const storageRef = ref(storage, "files/" + selectedFile?.name);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            const articleRef = collection(db, "Blog");
            console.log("Adding document to Firestore:", articleRef.path);

            addDoc(articleRef, {
              fileName: selectedFile.name,
              title: title,
              description: description,
              downloadURL: downloadURL,
              createdAt: Timestamp.now().toDate(),
            })
              .then(() => {
                setDescription("");

                setTitle("");
                setUploadProgress(0);
                setSelectedFile(null);

                const fileInput = document.getElementById("file");
                if (fileInput) {
                  fileInput.value = "";
                }

                toast.success("File uploaded successfully", {
                  position: "top-center",
                  autoClose: 1000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: false,
                  draggable: false,
                  progress: undefined,
                  theme: "light",
                });
              })
              .catch((err) => {
                toast("Error adding article", { type: "error" });
              });
          });
        }
      );
    }
  };


  const handleSignOut = () => {
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

      <h1 className="text-3xl font-semibold text-center py-4">
        Welcome To FileSafe
      </h1>

      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="p-4">
              <h2 className="text-2xl font-semibold mb-4">Enter Text Here</h2>
              <div>
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
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
              <h2 className="text-2xl font-semibold mb-4">Upload Files</h2>

              <input
                type="file"
                id="file"
                name="file"
                className="mb-4"
                accept=".jpg, .jpeg, .png, .gif, .pdf, .doc, .docx, .xls, .xlsx, .txt, .mp4, .avi, .mov"
                onChange={handleFileChange}
              />
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-gray-600 text-sm mb-2"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  placeholder="Enter file title"
                  value={title}
                  onChange={handleTitleChange}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-gray-600 text-sm mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  placeholder="Enter file description"
                  value={description}
                  onChange={handleDescriptionChange}
                />
              </div>
              <button
                onClick={handleUpload}
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
              >
                Upload
              </button>
              {uploadProgress > 0 && (
                <div className="mb-4">
                  <p className="font-semibold">Upload Progress:</p>
                  <div className="bg-blue-200 h-2 w-full">
                    <div
                      className="bg-blue-500 h-2"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <Blogs />
       
        </div>
      </div>
    </div>
  );
}

export default FileUpload;