import React, { useState, useEffect, useRef } from "react";

interface ImageLoaderProps {
  onFinishedLoading: () => void;
  children: any;
}

export const ImageLoader = ({ onFinishedLoading, children }: ImageLoaderProps) => {
  const parent_ref = useRef<HTMLDivElement | null>(null);

  // Collection of img elements
  const [images, setImages] = useState<Array<HTMLImageElement>>();

  // Keep track of how many images were loaded?
  const [loaded, setLoaded] = useState(0);

  // Tells us if onFinishedLoading was called
  const [called, setCalled] = useState(false);

  // Event to be fired either for load or error listener events
  const OnLoadEvent = () => setLoaded((state) => (state + 1));

  useEffect(
    () => {
      // Call OnFinishedLoading after 3s
      // Regardless if images didn't finish loading
      setTimeout(
        () => {
          if (!called) {
            onFinishedLoading();
            setCalled(true);
          }
        },
        3000
      );

      if (parent_ref && parent_ref.current) {
        const img_elements = Array.from(parent_ref.current.getElementsByTagName("img"))
          .filter((img) => img.id.startsWith("dyn-"));
        setImages(img_elements);

        // There are no images, which means we can execute our callback
        if (img_elements.length === 0)
          onFinishedLoading();
      }

      return () => {
        // Clean up event listeners on unmount
        if (images !== undefined) {
          for (const img of images) {
            img.removeEventListener("load", OnLoadEvent);
            img.removeEventListener("error", OnLoadEvent);
          }
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(
    () => {
      if (images !== undefined) {
        // Add load callback for every image
        for (const img of images) {
          // Preload image
          new Image().src = img.src;

          // Add event listeners, so we can determine
          // if the image was somehow loaded
          img.addEventListener("load", OnLoadEvent);
          img.addEventListener("error", OnLoadEvent);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images]
  );

  useEffect(
    () => {
      if (images !== undefined && !called) {
        if (loaded + 1 === images.length) {
          onFinishedLoading();
          setCalled(true);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loaded]
  );

  return (<div ref={parent_ref}>{children}</div>);
}