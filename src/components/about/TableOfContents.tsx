"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Column, Flex, Text } from "@/once-ui/components";
import styles from "./about.module.scss";

interface TableOfContentsProps {
  structure: {
    title: string;
    display: boolean;
    items: string[];
  }[];
  about: {
    tableOfContent: {
      display: boolean;
      subItems: boolean;
    };
  };
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ structure, about }) => {
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState<string>(structure[0]?.title || "");

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Track active section via IntersectionObserver */
  useEffect(() => {
    if (!mounted) return;

    const ids = structure
      .filter((s) => s.display)
      .flatMap((s) => [s.title, ...(about.tableOfContent.subItems ? s.items : [])]);

    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: "-10% 0px -50% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [mounted, structure, about.tableOfContent.subItems]);

  const scrollTo = (id: string, offset: number = 80) => {
    // If it's the very first section (e.g. Introduction), smoothly scroll to top
    if (id === structure[0]?.title) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveId(id);
      return;
    }

    const element = document.getElementById(id);
    if (!element) {
      console.warn(`[TOC] Section element with id "${id}" not found.`);
      return;
    }

    // If section is inside an unrevealed ScrollReveal, prime it so measurement is exact
    const revealParent = element.closest("[class*='reveal']") as HTMLElement | null;
    if (revealParent) {
      revealParent.style.opacity = "1";
      revealParent.style.transform = "none";
    }

    const elementTop = element.getBoundingClientRect().top;
    const targetY = elementTop + window.scrollY - offset;

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: "smooth",
    });

    setActiveId(id);
  };

  if (!about.tableOfContent.display) return null;
  if (!mounted) return null;

  return createPortal(
    <Column
      left="0"
      style={{
        top: "50%",
        transform: "translateY(-50%)",
        whiteSpace: "nowrap",
        zIndex: 50,
      }}
      position="fixed"
      paddingLeft="24"
      gap="32"
      hide="s"
    >
      {structure
        .filter((section) => section.display)
        .map((section, sectionIndex) => {
          const isActive = activeId === section.title;
          return (
            <Column key={sectionIndex} gap="12">
              <Flex
                cursor="interactive"
                className={`${styles.hover} ${isActive ? styles.tocActive : ""}`}
                gap="8"
                vertical="center"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(section.title, 80);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    scrollTo(section.title, 80);
                  }
                }}
                style={{ userSelect: "none", cursor: "pointer" }}
              >
                <Flex
                  height="1"
                  minWidth={isActive ? "24" : "16"}
                  background={isActive ? "brand-strong" : "neutral-strong"}
                  style={{
                    transition: "min-width 0.25s ease, background 0.25s ease",
                  }}
                />
                <Text
                  style={{
                    transition: "color 0.25s ease, opacity 0.25s ease",
                    opacity: isActive ? 1 : 0.55,
                    color: isActive ? "var(--brand-on-background-strong)" : undefined,
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {section.title}
                </Text>
              </Flex>
              {about.tableOfContent.subItems && (
                <>
                  {section.items.map((item, itemIndex) => {
                    const isSubActive = activeId === item;
                    return (
                      <Flex
                        hide="l"
                        key={itemIndex}
                        style={{ cursor: "pointer", userSelect: "none" }}
                        className={`${styles.hover} ${isSubActive ? styles.tocActive : ""}`}
                        gap="12"
                        paddingLeft="24"
                        vertical="center"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollTo(item, 80);
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            scrollTo(item, 80);
                          }
                        }}
                      >
                        <Flex
                          height="1"
                          minWidth={isSubActive ? "12" : "8"}
                          background={isSubActive ? "brand-strong" : "neutral-strong"}
                          style={{ transition: "min-width 0.25s ease, background 0.25s ease" }}
                        />
                        <Text
                          style={{
                            transition: "color 0.25s ease, opacity 0.25s ease",
                            opacity: isSubActive ? 1 : 0.45,
                            color: isSubActive ? "var(--brand-on-background-strong)" : undefined,
                            fontWeight: isSubActive ? 600 : 400,
                          }}
                        >
                          {item}
                        </Text>
                      </Flex>
                    );
                  })}
                </>
              )}
            </Column>
          );
        })}
    </Column>,
    document.body
  );
};

export default TableOfContents;
