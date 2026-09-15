"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useInView } from "@/once-ui/hooks/useInView";
import styles from "./Gallery.module.scss";

const certificates = [
  { src: "/images/gallery/image-01.jpg", description: "Certificate recognizing consistent learning and technical growth." },
  { src: "/images/gallery/image-02.jpg", description: "Achievement earned through hands-on project work and applied problem solving." },
  { src: "/images/gallery/image-03.jpg", description: "Credential highlighting practical exposure to modern data workflows." },
  { src: "/images/gallery/image-04.jpg", description: "Recognition for building analytical thinking through structured training." },
  { src: "/images/gallery/image-05.jpg", description: "Certificate focused on translating raw information into usable insights." },
  { src: "/images/gallery/image-06.jpg", description: "Milestone for completing a focused technical learning program." },
  { src: "/images/gallery/image-08.jpg", description: "Awarded for strengthening foundations in technology and analytics." },
  { src: "/images/gallery/image-09.jpg", description: "Credential showing participation in skill-building and professional development." },
  { src: "/images/gallery/image-11.jpg", description: "Certificate earned through guided practice and applied learning." },
  { src: "/images/gallery/image-12.jpg", description: "Recognition for completing a domain-focused technical module." },
  { src: "/images/gallery/image-13.jpg", description: "Achievement reflecting persistence, curiosity, and continuous improvement." },
  { src: "/images/gallery/image-14.jpg", description: "Credential connected to project-based learning and real-world thinking." },
  { src: "/images/gallery/image-15.jpg", description: "Certificate highlighting progress in analytical and digital skills." },
  { src: "/images/gallery/image-16.jpg", description: "Recognition for active participation in a technical learning experience." },
  { src: "/images/gallery/image-17.jpg", description: "Achievement showcasing commitment to expanding career-ready skills." },
  { src: "/images/gallery/image-18.jpg", description: "Certificate earned by completing practical tasks and assessments." },
  { src: "/images/gallery/image-19.jpg", description: "Credential supporting a growing portfolio in data and technology." },
  { src: "/images/gallery/image-20.jpg", description: "Recognition for learning, experimentation, and applied technical practice." },
  { src: "/images/gallery/image-22.jpg", description: "Achievement that reflects curiosity and steady professional development." },
  { src: "/images/gallery/image-23.jpg", description: "Certificate marking another step in the analytics learning journey." },
  { src: "/images/gallery/image-24.jpg", description: "Recognition for continued exploration across data, AI, and digital tools." },
];

const MasonryGrid = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const { ref: gridRef, inView: gridInView } = useInView<HTMLDivElement>({ threshold: 0.05 });

  const openImage = (index: number) => setSelectedIndex(index);
  const closeImage = () => setSelectedIndex(null);
  const showPrev = () =>
    setSelectedIndex((current) =>
      current === null ? null : (current - 1 + certificates.length) % certificates.length
    );
  const showNext = () =>
    setSelectedIndex((current) => (current === null ? null : (current + 1) % certificates.length));

  const selectedCertificate = selectedIndex !== null ? certificates[selectedIndex] : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedCertificate ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedCertificate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeImage();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div
        ref={gridRef}
        className={[styles.masonryGrid, gridInView ? styles.masonryGridRevealed : ""].join(" ")}
      >
        {certificates.map((certificate, index) => (
          <div
            key={certificate.src}
            className={styles.imageContainer}
            style={{ ["--tile-delay" as any]: `${(index % 8) * 0.07}s` }}
            onClick={() => openImage(index)}
          >
            <img
              src={certificate.src}
              alt={`Certificate ${index + 1}`}
              className={styles.gridImage}
              loading="lazy"
              decoding="async"
            />
            <p className={styles.imageCaption}>{certificate.description}</p>
          </div>
        ))}
      </div>

      {mounted &&
        selectedCertificate &&
        createPortal(
          <div className={styles.lightbox} onClick={closeImage}>
            <button
              type="button"
              className={`${styles.lightboxNav} ${styles.lightboxNavPrev}`}
              onClick={(event) => {
                event.stopPropagation();
                showPrev();
              }}
              aria-label="Previous certificate"
            >
              ‹
            </button>
            <div className={styles.lightboxPanel} onClick={(event) => event.stopPropagation()}>
              <button
                type="button"
                className={styles.lightboxClose}
                onClick={closeImage}
                aria-label="Close"
              >
                ✕
              </button>
              <img
                src={selectedCertificate.src}
                alt="Full certificate view"
                className={styles.lightboxImage}
                decoding="async"
              />
              <div className={styles.lightboxDescription}>
                <span>
                  Certificate detail · {selectedIndex !== null ? selectedIndex + 1 : 0} /{" "}
                  {certificates.length}
                </span>
                <p>{selectedCertificate.description}</p>
                <button type="button" onClick={closeImage}>
                  Close
                </button>
              </div>
            </div>
            <button
              type="button"
              className={`${styles.lightboxNav} ${styles.lightboxNavNext}`}
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              aria-label="Next certificate"
            >
              ›
            </button>
          </div>,
          document.body
        )}
    </>
  );
};

export default MasonryGrid;
