"use client";

import React, { useState } from "react";
import { mailchimp } from "@/app/resources";
import { Background, Column, Flex, Heading, Text } from "@/once-ui/components";

type NewsletterProps = {
  display: boolean;
  title: string | React.JSX.Element;
  description: string | React.JSX.Element;
};

export const Mailchimp = ({ newsletter }: { newsletter: NewsletterProps }) => {
  const googleFormUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLScyB9qqiyI9vGWXqcUuMXqGVb7n2_XPIe0LX-qEv5g_1vsSHw/viewform?usp=sharing&ouid=115475524829771014354";

  const [hovered, setHovered] = useState(false);

  return (
    <Column
      overflow="visible"
      position="relative"
      fillWidth
      padding="xl"
      radius="l"
      marginBottom="m"
      horizontal="center"
      align="center"
      style={{
        isolation: "isolate",
        maxWidth: "1160px",
        margin: "0 auto",
        background: "transparent",
        border: "none",
        boxShadow: "none",
      }}
    >
      {/* Animated border wrapper */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "var(--radius-l, 16px)",
          padding: "1.5px",
          background:
            "conic-gradient(from var(--angle, 0deg), transparent 20%, rgba(236,72,153,0.7) 40%, rgba(139,92,246,0.9) 50%, rgba(236,72,153,0.7) 60%, transparent 80%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          animation: "rotateBorder 4s linear infinite",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <style>{`
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes rotateBorder {
          to { --angle: 360deg; }
        }
      `}</style>

      <Background
        position="absolute"
        mask={{
          cursor: mailchimp.effects.mask.cursor,
          x: mailchimp.effects.mask.x,
          y: mailchimp.effects.mask.y,
          radius: mailchimp.effects.mask.radius,
        }}
        gradient={{
          display: mailchimp.effects.gradient.display,
          x: mailchimp.effects.gradient.x,
          y: mailchimp.effects.gradient.y,
          width: mailchimp.effects.gradient.width,
          height: mailchimp.effects.gradient.height,
          tilt: mailchimp.effects.gradient.tilt,
          colorStart: mailchimp.effects.gradient.colorStart,
          colorEnd: mailchimp.effects.gradient.colorEnd,
          opacity: mailchimp.effects.gradient.opacity as
            | 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100,
        }}
        dots={{
          display: mailchimp.effects.dots.display,
          color: mailchimp.effects.dots.color,
          size: mailchimp.effects.dots.size as any,
          opacity: mailchimp.effects.dots.opacity as any,
        }}
        grid={{
          display: mailchimp.effects.grid.display,
          color: mailchimp.effects.grid.color,
          width: mailchimp.effects.grid.width as any,
          height: mailchimp.effects.grid.height as any,
          opacity: mailchimp.effects.grid.opacity as any,
        }}
        lines={{
          display: mailchimp.effects.lines.display,
          opacity: mailchimp.effects.lines.opacity as any,
        }}
      />

      {/* Decorative ring */}
      <div
        style={{
          position: "absolute",
          top: "-40px",
          right: "-40px",
          width: "260px",
          height: "260px",
          border: "1px solid rgba(236,72,153,0.16)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "0px",
          right: "0px",
          width: "170px",
          height: "170px",
          border: "1px solid rgba(236,72,153,0.22)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Badge pill */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 14px",
          borderRadius: "999px",
          border: "1px solid rgba(236,72,153,0.45)",
          background: "rgba(236,72,153,0.14)",
          marginBottom: "20px",
          fontSize: "var(--font-size-body-s)",
          color: "#f472b6",
          fontWeight: 600,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        <span style={{ fontSize: "10px" }}>✦</span>
        Newsletter
      </div>

      <Heading
        style={{ position: "relative", zIndex: 1, textAlign: "center" }}
        marginBottom="s"
        variant="display-strong-s"
      >
        {newsletter.title}
      </Heading>

      <Text
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "var(--responsive-width-xs)",
          textAlign: "center",
        }}
        wrap="balance"
        marginBottom="xl"
        onBackground="neutral-medium"
      >
        {newsletter.description}
      </Text>

      {/* Feature pills */}
      <Flex
        gap="12"
        wrap
        horizontal="center"
        style={{ position: "relative", zIndex: 1, marginBottom: "32px" }}
      >
        {["Data Insights", "AI Trends", "Analytics Tips", "Weekly Drops"].map((tag) => (
          <div
            key={tag}
            style={{
              padding: "6px 14px",
              borderRadius: "999px",
              border: "1px solid var(--neutral-alpha-weak)",
              background: "transparent",
              fontSize: "var(--font-size-body-s)",
              color: "var(--neutral-on-background-medium)",
            }}
          >
            {tag}
          </div>
        ))}
      </Flex>

      {/* CTA Button */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <a
          href={googleFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 32px",
            borderRadius: "999px",
            background: hovered
              ? "linear-gradient(135deg, #a78bfa, #ec4899)"
              : "linear-gradient(135deg, #8b5cf6, #db2777)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "var(--font-size-body-m)",
            textDecoration: "none",
            boxShadow: hovered
              ? "0 12px 36px rgba(236,72,153,0.45)"
              : "0 6px 20px rgba(236,72,153,0.3)",
            transform: hovered ? "translateY(-2px) scale(1.03)" : "translateY(0) scale(1)",
            transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
            border: "1px solid rgba(236,72,153,0.4)",
          }}
        >
          <span>Subscribe Now</span>
          <span style={{ fontSize: "18px", lineHeight: 1 }}>→</span>
        </a>
      </div>

      {/* Subscriber note */}
      <Text
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: "16px",
          fontSize: "var(--font-size-body-xs)",
          opacity: 0.5,
          textAlign: "center",
        }}
        onBackground="neutral-weak"
      >
        No spam, unsubscribe anytime. Join data enthusiasts worldwide.
      </Text>
    </Column>
  );
};