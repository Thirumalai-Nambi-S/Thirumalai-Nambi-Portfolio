import { Flex, IconButton, SmartLink, Text } from "@/once-ui/components";
import { person, social } from "@/app/resources/content";
import { Panel } from "@/components/Panel";
import styles from "./Footer.module.scss";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Flex
      as="footer"
      position="relative"
      zIndex={2}
      fillWidth
      padding="8"
      horizontal="center"
      mobileDirection="column"
    >
      <Panel
        accent="violet"
        noPadding
        className={styles.footerPanel}
      >
        <Flex
          className={styles.mobile}
          maxWidth="l"
          paddingY="8"
          paddingX="16"
          gap="16"
          horizontal="space-between"
          vertical="center"
        >
          <Text variant="body-default-s" onBackground="neutral-strong">
            <Text onBackground="neutral-weak">© {currentYear} /</Text>
            <Text paddingX="4">{person.name}</Text>
            <Text onBackground="neutral-weak">
              {/* Usage of this template requires attribution. Please don't remove the link to Once UI. */}
              / My{" "}
              <SmartLink
                style={{ marginLeft: "-0.125rem" }}
                href="https://github.com/Thirumalai-Nambi-S/Thirumalai-Nambi-Portfolio"
              >
                PortFolio
              </SmartLink>
            </Text>
          </Text>
          <Flex gap="16">
            {social.map(
              (item) =>
                item.link && (
                  <span key={item.name} className={styles.socialIconWrap}>
                    <IconButton
                      href={item.link}
                      icon={item.icon}
                      tooltip={item.name}
                      size="s"
                      variant="ghost"
                    />
                  </span>
                ),
            )}
          </Flex>
        </Flex>
      </Panel>
      <Flex height="80" show="s"></Flex>
    </Flex>
  );
};
