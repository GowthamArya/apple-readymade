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

interface AbandonedCartEmailProps {
    productName: string;
    url: string;
    imageUrl?: string | null;
}

export default function AbandonedCartEmail({
    productName,
    url,
    imageUrl,
}: AbandonedCartEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>You left something behind!</Preview>

            <Body style={styles.body}>
                {/* Outer Wrapper */}
                <Section style={styles.outerWrapper}>
                    {/* Main Card */}
                    <Container style={styles.card}>
                        {/* Logo */}
                        <Img
                            src="https://rkwxsjrwvooyalymhedv.supabase.co/storage/v1/object/public/apple/logo.png"
                            width="80"
                            height="80"
                            alt="Apple Menswear"
                            style={styles.logo}
                        />

                        <Text style={styles.heading}>Still thinking about it?</Text>

                        <Text style={styles.subText}>
                            Your <strong>{productName}</strong> is waiting for you in your cart. Only a few left in stock!
                        </Text>

                        {/* Product Image */}
                        {imageUrl && (
                            <Section style={styles.imageContainer}>
                                <Img
                                    src={imageUrl}
                                    width="200"
                                    style={styles.productImage}
                                    alt={productName}
                                />
                            </Section>
                        )}

                        {/* Button */}
                        <Button href={url} style={styles.button}>
                            Complete Your Order
                        </Button>

                        {/* Divider */}
                        <Section style={styles.dividerWrapper}>
                            <Section style={styles.divider} />
                        </Section>

                        {/* Disclaimer */}
                        <Text style={styles.disclaimer}>
                            If you didn’t add this to your cart, you can safely ignore this email.
                        </Text>
                    </Container>

                    {/* Footer */}
                    <Container style={styles.footer}>
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
        margin: "0 0 24px 0",
    },
    imageContainer: {
        margin: "24px 0",
        textAlign: "center" as const,
    },
    productImage: {
        borderRadius: "8px",
        objectFit: "contain" as const,
        maxWidth: "100%",
        margin: "0 auto",
    },
    button: {
        display: "inline-block",
        padding: "14px 32px",
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
