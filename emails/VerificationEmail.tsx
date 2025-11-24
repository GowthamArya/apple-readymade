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
    backgroundColor: "#CEE5D0",
    fontFamily: "Arial, sans-serif",
  },

  outerWrapper: {
    backgroundColor: "#CEE5D0",
    padding: "20px",
    width: "100%",
  },

  card: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "40px",
    textAlign: "center" as const,
    margin: "0 auto",
  },

  logo: {
    marginBottom: "20px",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },


  heading: {
    color: "#333",
    fontSize: "24px",
    margin: "0 0 10px 0",
    fontWeight: "bold",
  },

  subText: {
    color: "#555",
    fontSize: "14px",
    margin: "0 0 10px 0",
  },

  button: {
    display: "inline-block",
    padding: "14px 28px",
    marginTop: "15px",
    backgroundColor: "#3A6F43",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: "bold",
  },

  dividerWrapper: {
    margin: "30px auto",
    width: "80%",
  },

  divider: {
    borderTop: "1px solid #eee",
    width: "100%",
  },

  disclaimer: {
    color: "#888",
    fontSize: "12px",
    lineHeight: "18px",
    marginTop: "10px",
  },

  footer: {
    width: "100%",
    maxWidth: "600px",
    textAlign: "center" as const,
    margin: "20px auto 0",
    padding: "10px 20px",
  },

  footerText: {
    fontSize: "11px",
    color: "#b5b5b5",
    margin: "4px 0",
  },
};
