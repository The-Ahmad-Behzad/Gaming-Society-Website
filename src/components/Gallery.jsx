import { storage } from "../auth/Auth";
import { useEffect, useState } from "react";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Carousel from "./Carousel"; // Import the Carousel component

export default function Gallery() {
  const [img, setImg] = useState(null);
  const [imgUrl, setImgUrl] = useState([]);
  const [slides, setSlides] = useState([]);

  const handleClick = () => {
    if (img) {
      const imgRef = ref(storage, `gallery/${v4()}`);
      uploadBytes(imgRef, img, { contentType: img.type })
        .then((value) => {
          console.log("Uploaded a blob or file!", value);
          getDownloadURL(value.ref).then((url) => {
            setImgUrl((data) => {
              if (!data.includes(url)) {
                return [...data, url];
              }
              return data;
            });
          });
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    } else {
      console.error("No image selected");
    }
  };

  useEffect(() => {
    listAll(ref(storage, "gallery")).then((imgs) => {
      imgs.items.forEach((val) => {
        getDownloadURL(val).then((url) => {
          setImgUrl((data) => {
            if (!data.includes(url)) {
              return [...data, url];
            }
            return data;
          });
        });
      });
    });
  }, []);

  useEffect(() => {
    // Update slides whenever imgUrl changes
    const allSlides = imgUrl.map((url, index) => (
      <div className="center-content" key={index}>
        <img className="cover-img" src={url} width="200" height="200" alt="Uploaded file" />
        <button className="loginButton" onClick={() => downloadImage(url)}>Download</button>
      </div>
    ));
    setSlides(allSlides);
  }, [imgUrl]);

  const downloadImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      const filename = url.substring(url.lastIndexOf("/") + 1) || "image";
      const blobUrl = URL.createObjectURL(blob);
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const downloadAllImagesAsZip = async () => {
    const zip = new JSZip();
    const folder = zip.folder("images");

    for (const url of imgUrl) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        let filename = url.substring(url.lastIndexOf("/") + 1) || `image${v4()}`;
        const mimeType = blob.type;
        const extension = mimeType.split("/")[1];
        if (!filename.includes(`.${extension}`)) {
          filename += `.${extension}`;
        }
        folder.file(filename, blob);
      } catch (error) {
        console.error(`Error fetching image from ${url}:`, error);
      }
    }

    zip.generateAsync({ type: "blob" })
      .then((content) => {
        saveAs(content, "images.zip");
      })
      .catch((error) => {
        console.error("Error generating zip file:", error);
      });
  };

  return (
    <>
      <div className="card">
        <input type="file" onChange={(e) => setImg(e.target.files[0])} />
        <button onClick={handleClick}>Upload</button>
        <br />
        </div>
        <div>
        <Carousel heading="Gallery" slides={slides} />
        </div>
        <div className="card">
        <button onClick={downloadAllImagesAsZip}>Download All as ZIP</button>
      </div>
    </>
  );
}
