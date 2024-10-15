import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

function GalRow(props) {
  let container = document.querySelector('.dynamic-gallery');
  const [width, setWidth] = useState(0);
  const totalVal = props.photos.reduce((sum, item) => sum + (item.width / item.height), 0);
  const containerRef = useRef(null);

  const updateWidth = () => {
    if (containerRef.current) {
      setWidth(containerRef.current.clientWidth);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div
      ref={containerRef}
      className="gallery-row">
      {props.photos.map((item, index) => (
        <div 
          className={`gallery-img-${index}`}
          style = {{display: 'table-cell'}}>
          <img src={item.src} name={item} style={{height: `${(width / totalVal)}px`, width: 'auto'}}/>
        </div>
      ))}
    </div>
  )
}

export function DynamGallery(props) {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchImages = async (options) => {
      let len = options.length;
      let fetchedPhotos = [];
      if (len === 0) {
        for (let i = 0; i < 4; i++) {
          let photoRow = []
          for (let j = 0; j < 3; j++) {
            await axios.get('https://dog.ceo/api/breeds/image/random').then((res) => {
              const img = new Image();
              img.src = res.data.message;
              img.onload = function() {
                const width = img.naturalWidth;
                const height = img.naturalHeight;
                photoRow.push({
                  src: img.src,
                  width: width,
                  height: height,
                });
              }
            }).catch((error) => {
              console.error("Error fetching data:", error);
            });
          }
          fetchedPhotos.push(photoRow);
        }
      }
      else {
        for (let i = 0; i < 4; i++) {
          let photoRow = []
          for (let j = 0; j < 3; j++) {
            await axios.get(`https://dog.ceo/api/breed/${options[i % len].value}/images/random`).then((res) => {
              const img = new Image();
              img.src = res.data.message;
              img.onload = function() {
                const width = img.naturalWidth;
                const height = img.naturalHeight;
                photoRow.push({
                  src: img.src,
                  width: width,
                  height: height,
                });
              }
            }).catch((error) => {
              console.error("Error fetching data:", error);
            });
          }
          fetchedPhotos.push(photoRow);
        }
      }
      setPhotos(fetchedPhotos);
    };
    fetchImages(props.options);
  }, [props.options, props.seed]);

  return (
    <div className="dynamic-gallery">
      {photos.map((item) => (
        <GalRow
          photos={item}
          reisze={props.resize}/>
      ))}
    </div>
  );
}