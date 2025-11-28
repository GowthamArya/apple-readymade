import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  url: string;
}

export default function VerificationEmail({ url }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Sign in to Apple Menswear</Preview>

      <Body style={styles.body}>
        {/* Outer Wrapper */}
        <Section style={styles.outerWrapper}>
          {/* Main Card */}
          <Container style={styles.card}>
            {/* Logo */}
            <Img
              src="https://apple-readymade.vercel.app/logo.png"
              width="60"
              height="60"
              alt="Apple Menswear"
              style={styles.logo}
            />

            <Text style={styles.heading}>Sign in to Apple</Text>

            <Text style={styles.subText}>We don’t store any password.</Text>
            <Text style={styles.subText}>
              Use the secure button below to sign in.
            </Text>

            {/* Button */}
            <Button href={url} style={styles.button}>
              Sign in to your account
            </Button>

            {/* Divider */}
            <Section style={styles.dividerWrapper}>
              <Section style={styles.divider} />
            </Section>

            {/* Disclaimer */}
            <Text style={styles.disclaimer}>
              If you didn’t request this email, you can safely ignore it.
              <br />
              This magic link will be valid for <strong>10 minutes</strong>.
            </Text>
          </Container>

          {/* Footer */}
          <Container style={styles.footer}>
            <Text style={styles.footerText}>
              You’re receiving this email because a sign-in was requested for
              your account.
            </Text>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} Apple Menswear. All rights reserved.
            </Text>
          </Container>
        </Section>
      </Body>
    </Html>
  );
}

/* Styles */

const styles = {
  body: {
    margin: 0,
    padding: 0,
    backgroundColor: "#f6f9fc",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  },

  outerWrapper: {
    backgroundColor: "#f6f9fc",
    padding: "40px 20px",
    width: "100%",
  },

  card: {
    width: "100%",
    maxWidth: "480px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "48px 32px",
    textAlign: "center" as const,
    margin: "0 auto",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  },

  logo: {
    marginBottom: "32px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },

  heading: {
    color: "#1a1a1a",
    fontSize: "24px",
    margin: "0 0 16px 0",
    fontWeight: "600",
    letterSpacing: "-0.5px",
  },

  subText: {
    color: "#4a4a4a",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "0 0 8px 0",
  },

  button: {
    display: "inline-block",
    padding: "14px 32px",
    marginTop: "32px",
    backgroundColor: "#3A6F43",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(58, 111, 67, 0.2)",
  },

  dividerWrapper: {
    margin: "40px auto",
    width: "100%",
  },

  divider: {
    borderTop: "1px solid #eaeaea",
    width: "100%",
  },

  disclaimer: {
    color: "#888888",
    fontSize: "13px",
    lineHeight: "20px",
    marginTop: "12px",
  },

  footer: {
    width: "100%",
    maxWidth: "480px",
    textAlign: "center" as const,
    margin: "32px auto 0",
    padding: "0 20px",
  },

  footerText: {
    fontSize: "12px",
    color: "#999999",
    margin: "8px 0",
    lineHeight: "18px",
  },
};
