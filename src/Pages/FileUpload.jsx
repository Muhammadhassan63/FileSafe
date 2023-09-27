import React, { useEffect, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import storage from "../utils/firebase";

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const listRef = ref(storage, 'files/');

    // Find all the prefixes and items.
    listAll(listRef)
      .then((res) => {
        const files = [];
        res.items.forEach((itemRef) => {
          files.push(itemRef);
        });
        setFileList(files);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log("Uploading:", selectedFile);
      const storageRef = ref(storage, "files/" + selectedFile?.name);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setUploadProgress(progress);

          if (progress === 100) {
            // Refresh the page when upload is complete
            window.location.reload();
          }

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
          setSelectedFile(null);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
          });
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold text-center py-4">
        Welcome To FileSafe
      </h1>

      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
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
                multiple
              />
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
          <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
              <h2 className="text-2xl font-semibold mb-4">File List</h2>
              <ul>
                {fileList.map((file, index) => (
                  <li key={index} className="py-2 border-b">
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{file.name}</span>
                      <div>
                        <a
                          href="#"
                          onClick={() => {
                            getDownloadURL(file).then((downloadURL) => {
                              window.open(downloadURL);
                            });
                          }}
                          className="text-blue-500 hover:underline mr-4"
                        >
                          Download
                        </a>
                        <button
                          onClick={() => {
                            const desertRef = ref(storage, `files/${file.name}`);
                            deleteObject(desertRef)
                              .then(() => {
                                alert(`${file.name} Deleted Successfully`);
                                // Update the file list after deletion
                                const updatedList = fileList.filter(
                                  (item) => item.name !== file.name
                                );
                                setFileList(updatedList);
                              })
                              .catch((error) => {
                                alert(`Error occurred: ${error}`);
                              });
                          }}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
