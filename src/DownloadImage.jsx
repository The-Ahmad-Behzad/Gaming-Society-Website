import React, { useState, useEffect } from 'react';
import { listAll, getStorage, ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../auth/Auth';

import "../css/gallery.css"
import Gallery from './Gallery';

const DownloadImage = () => {
  const [images, setImages] = useState([]);
  const [imageReferences, setImageReferences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const storage = getStorage();
    const listRef = ref(storage, 'gallery');
//    listAll(listRef).then((res) => console.log(res.items[0].fullPath))

    // Get all images from the 'gallery' folder
    listAll(listRef)
      .then((res) => {
        const imageUrls = res.items.map((item) => {
          return getDownloadURL(item);
        });

        Promise.all(imageUrls)
          .then((urls) => {
            console.log(urls[0].fullPath)
            setImages(urls);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('Error getting image URLs:', error);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        console.error('Error listing images:', error);
        setIsLoading(false);
      });
  }, []);


    function downloadImage(imgUrl) {
        const listRef = ref(storage, 'gallery');
        listAll(listRef)
        .then((res) => {
          const imageUrls = res.items.map((item) => {
            console.log(item.fullPath)
            return getDownloadURL(item);
          })});
  
        getDownloadURL(ref(storage, "gallery/logo.png"))
        .then((url) => {
        // `url` is the download URL for 'images/stars.jpg'

        // This can be downloaded directly:
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
        const blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();

        // Or inserted into an <img> element
        const img = document.getElementById('myimg');
        img.setAttribute('src', url);
        })
        .catch((error) => {
            // Handle any errors
        });
    }


  return (
    <div >
      {isLoading ? (
        <p>Loading images...</p>
      ) : (
        <ul>
          {console.log(images[0])}
          {images.map((imageUrl, index) => (
            <li className='card' key={index}>
                <a href={imageUrl} download>
                <img className='downloaded-image' src={imageUrl} alt={`Image ${index + 1}`} />
                </a>
              <button onClick={() => downloadImage(imageUrl)}>Download</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DownloadImage;
