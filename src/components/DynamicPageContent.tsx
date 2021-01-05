import React, { useEffect, useRef, useState } from "react"
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperClass from 'swiper/types/swiper-class';
import playCircle from '../resources/icons/play-circle.svg';
import deleteForever from '../resources/icons/delete.svg';
import '../styles/SwiperTest.scss'

interface DynamicPageProps {
    page: number;
}

const MAX_IMAGES = 5;
const MAX_FILES = 10;

export const DynamicPageContent: React.FC<DynamicPageProps> = ({page}) => {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [Files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileInputState, setFileInputState] = useState({
    multiple: true,
    accept: 'image/*, video/*',
  });

  const swiperOptions = {
    slidesPerView: 'auto' as number | 'auto' | undefined,
    // watchOverflow: true,
    freeMode: true,
    freeModeMomentumRatio: 0.75,
    touchMoveStopPropagation: true,
  };

  const mediaSlides: JSX.Element[] = [];
  if (Files) {
    Files.forEach((file, index) => {
      console.log(file);
      mediaSlides.push(
        <SwiperSlide key={index}>
          <div className="card">
            <img src={fileUrls[index]} alt="Card" />
            <img className="icon-delete" src={deleteForever} alt="delete" onClick={() => deleteFile(index)} />
            {file.type.startsWith('video') && <img className="icon-play" src={playCircle} alt="play"/>}
          </div>
        </SwiperSlide>,
      );
    });
  }

  function deleteFile(indexSelected: number) {
    if (Files) {
      setFiles(Files.filter((file, index) => index !== indexSelected))
      setFileUrls(fileUrls.filter((url, index) => index !== indexSelected));
    }
  }

  async function onUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const {
      target: { validity, files },
    } = event;
    if (files && validity.valid) {
      const imagesCount = files
        ? Files.filter(meta => meta.type.startsWith('image')).length
        : 0;
      const filesCount = Files ? Files.length : 0;

      const newFiles: File[] = [];
      const newUrls: string[] = [];
      let newImagesCount = 0;

      for (let i = 0; i < files.length; i++) {
        const isImage = files[i].type.startsWith('image');
        const notMaxFiles = filesCount + newFiles.length < MAX_FILES;
        const notMaxImages = imagesCount + newImagesCount < MAX_IMAGES;

        if (notMaxFiles) {
          if (isImage && notMaxImages) {
            newImagesCount++;
            newFiles.push(files[i]);
            newUrls.push(URL.createObjectURL(files[i]));
          }
          if (!isImage) {
            newFiles.push(files[i]);
            newUrls.push(
              URL.createObjectURL(files[i]),
            );
          }
        } else {
          console.log('Too many files!');
          break;
        }
      }
      setFileUrls([...fileUrls, ...newUrls]);
      setFiles(Files ? [...Files, ...newFiles] : newFiles);
    }
  }

  useEffect(() => {
    if (swiper) {
      swiper.slideTo(fileUrls.length - 1, 0);
    }
  }, [fileUrls.length, swiper]);

  return (
    <div id="swiper-page">
    <div id="media-carousel-card">
      <Swiper {...swiperOptions} onSwiper={(Swiper) => setSwiper(Swiper) }>
      <SwiperSlide>
        <div className="card" onClick={() => fileInputRef.current?.click()}>
          <span>Add Event Image/Video</span>
        </div>
      </SwiperSlide>
      </Swiper>
    </div>
        <input type="file" ref={fileInputRef} onChange={onUpload} {...fileInputState} />
    </div>
  )
}