import {
    Body,
    Container,
    Head,
    Html,
    Img,
    Preview,
    Section,
    Text,
    Button,
    Hr,
} from "@react-email/components";
import * as React from "react";

interface OrderStatusUpdateEmailProps {
    orderId: string;
    customerName: string;
    status: string;
    message?: string;
    trackingUrl?: string; // for shipped orders
    actionUrl?: string; // link to order details
}

export default function OrderStatusUpdateEmail({
    orderId,
    customerName,
    status,
    message,
    trackingUrl,
    actionUrl
}: OrderStatusUpdateEmailProps) {
    const logoUrl = "https://rkwxsjrwvooyalymhedv.supabase.co/storage/v1/object/public/apple/logo.png";

    const getStatusColor = (s: string) => {
        switch (s.toLowerCase()) {
            case 'shipped': return '#2196F3';
            case 'delivered': return '#4CAF50';
            case 'cancelled': return '#F44336';
            case 'returned': return '#FF9800';
            case 'refunded': return '#9C27B0';
            default: return '#333333';
        }
    };

    const getStatusTitle = (s: string) => {
        switch (s.toLowerCase()) {
            case 'shipped': return 'Your Order is on the Way!';
            case 'delivered': return 'Your Order has Arrived!';
            case 'cancelled': return 'Order Cancelled';
            case 'returned': return 'Return Processed';
            case 'refunded': return 'Refund Processed';
            default: return `Order Update: ${s}`;
        }
    };

    const statusColor = getStatusColor(status);
    const title = getStatusTitle(status);

    return (
        <Html>
            <Head />
            <Preview>{title} - Order #{orderId}</Preview>
            <Body style={styles.body}>
                <Container style={styles.container}>
                    <Section style={styles.header}>
                        <Img
                            src={logoUrl}
                            width="80"
                            height="80"
                            alt="Apple Menswear"
                            style={styles.logo}
                        />
                    </Section>

                    <Text style={{ ...styles.title, color: statusColor }}>{title}</Text>

                    <Text style={styles.greeting}>Hi {customerName},</Text>

                    <Text style={styles.text}>
                        {message || `The status of your order #${orderId} has been updated to ${status}.`}
                    </Text>

                    {trackingUrl && (
                        <Section style={styles.actionSection}>
                            <Button href={trackingUrl} style={styles.button}>
                                Track Package
                            </Button>
                        </Section>
                    )}

                    {!trackingUrl && actionUrl && (
                        <Section style={styles.actionSection}>
                            <Button href={actionUrl} style={styles.button}>
                                View Order Details
                            </Button>
                        </Section>
                    )}

                    <Hr style={styles.divider} />

                    <Text style={styles.footer}>
                        If you have any questions, reply to this email or contact us at +91 9849521212.
                    </Text>
                    <Text style={styles.footer}>
                        © {new Date().getFullYear()} Apple Menswear. All rights reserved.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

const styles = {
    body: {
        backgroundColor: "#f6f9fc",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
        margin: "0",
        padding: "20px 0",
    },
    container: {
        backgroundColor: "#ffffff",
        margin: "0 auto",
        padding: "40px 20px",
        borderRadius: "12px",
        maxWidth: "600px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    },
    header: {
        textAlign: "center" as const,
        marginBottom: "30px",
    },
    logo: {
        borderRadius: "50%",
        margin: "0 auto",
    },
    title: {
        fontSize: "24px",
        fontWeight: "700",
        textAlign: "center" as const,
        marginBottom: "24px",
        textTransform: "capitalize" as const,
    },
    greeting: {
        fontSize: "18px",
        fontWeight: "600",
        color: "#333",
        marginBottom: "12px",
    },
    text: {
        fontSize: "16px",
        color: "#4a4a4a",
        marginBottom: "24px",
        lineHeight: "24px",
    },
    actionSection: {
        textAlign: "center" as const,
        margin: "30px 0",
    },
    button: {
        backgroundColor: "#111",
        color: "#fff",
        padding: "12px 30px",
        borderRadius: "6px",
        textDecoration: "none",
        fontSize: "16px",
        fontWeight: "600",
    },
    divider: {
        borderColor: "#e6ebf1",
        margin: "30px 0",
    },
    footer: {
        fontSize: "12px",
        color: "#999",
        textAlign: "center" as const,
        marginTop: "10px",
        lineHeight: "18px",
    },
};
