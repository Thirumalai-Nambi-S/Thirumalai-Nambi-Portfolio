"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Fade, Flex, Line, ToggleButton } from "@/once-ui/components";
import styles from "@/components/Header.module.scss";
import { MobileMenu } from "@/components/MobileMenu";

import { routes, display } from "@/app/resources";
import { person, home, about, work, project, contact, gallery } from "@/app/resources/content";

type TimeDisplayProps = {
  timeZone: string;
  locale?: string; // Optionally allow locale, defaulting to 'en-GB'
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeZone, locale = "en-GB" }) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const timeString = new Intl.DateTimeFormat(locale, options).format(now);
      setCurrentTime(timeString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [timeZone, locale]);

  return <>{currentTime}</>;
};

export default TimeDisplay;

export const Header = () => {
  const pathname = usePathname() ?? "";
  // On very small screens only the active route keeps its text label (see Header.module.scss)
  const nav = (selected: boolean) => (selected ? styles.navBtnActive : styles.navBtn);

  return (
    <>
      <Fade hide="s" fillWidth position="fixed" height="80" zIndex={9} />
      <Fade show="s" fillWidth position="fixed" bottom="0" to="top" height="80" zIndex={9} />
      <Flex
        fitHeight
        className={styles.position}
        as="header"
        zIndex={9}
        fillWidth
        padding="16"
        horizontal="center"
      >
        <div className={styles.headerGrid}>
          <Flex paddingLeft="20" vertical="center" textVariant="body-default-s">
            {display.location && <Flex hide="s">{person.location}</Flex>}
          </Flex>
          <Flex horizontal="center">
            <Flex
              className={`${styles.navScroll} ${styles.navPill}`}
              background="surface"
              border="neutral-medium"
              radius="m-4"
              shadow="l"
              padding="4"
              horizontal="center"
            >
              <Flex gap="4" vertical="center" textVariant="body-default-s">
                {routes["/"] && (
                  <ToggleButton prefixIcon="home" href="/" aria-label="Home" className={nav(pathname === "/")} selected={pathname === "/"} />
                )}
                <Line vert maxHeight="24" />
                {routes["/about"] && (
                  <ToggleButton
                    prefixIcon="person"
                    href="/about"
                    className={nav(pathname === "/about")}
                    label={about.label}
                    selected={pathname === "/about"}
                  />
                )}
                {routes["/project"] && (
                  <ToggleButton
                    prefixIcon="play"
                    href="/project"
                    className={nav(pathname.startsWith("/project"))}
                    label={project.label}
                    selected={pathname.startsWith("/project")}
                  />
                )}
                {routes["/work"] && (
                  <ToggleButton
                    prefixIcon="grid"
                    href="/work"
                    className={nav(pathname.startsWith("/work"))}
                    label={work.label}
                    selected={pathname.startsWith("/work")}
                  />
                )}
                {routes["/gallery"] && (
                  <ToggleButton
                    prefixIcon="gallery"
                    href="/gallery"
                    className={nav(pathname.startsWith("/gallery"))}
                    label={gallery.label}
                    selected={pathname.startsWith("/gallery")}
                  />
                )}
                {routes["/contact"] && (
                  <>
                    <Line vert maxHeight="24" />
                    <ToggleButton
                      prefixIcon="contact"
                      href="/contact"
                      className={nav(pathname.startsWith("/contact"))}
                      label={contact.label}
                      selected={pathname.startsWith("/contact")}
                    />
                  </>
                )}
                {/* phones / small tablets only: hamburger for Games + Theme Studio */}
                <span className={styles.menuWrap}>
                  <Line vert maxHeight="24" />
                  <MobileMenu />
                </span>
              </Flex>
            </Flex>
          </Flex>
          <Flex horizontal="end" vertical="center">
            <Flex
              paddingRight="20"
              horizontal="end"
              vertical="center"
              textVariant="body-default-s"
              gap="20"
            >
              <Flex hide="s">{display.time && <TimeDisplay timeZone={person.location} />}</Flex>
            </Flex>
          </Flex>
        </div>
      </Flex>
    </>
  );
};
