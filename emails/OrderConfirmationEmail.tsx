import {
    Body,
    Container,
    Head,
    Html,
    Img,
    Preview,
    Section,
    Text,
    Row,
    Column,
    Hr,
} from "@react-email/components";
import * as React from "react";

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    variant?: string; // e.g. "M / Red"
}

interface OrderConfirmationEmailProps {
    orderId: string;
    customerName: string;
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: string;
    orderDate: string;
}

export default function OrderConfirmationEmail({
    orderId,
    customerName,
    items = [],
    totalAmount,
    shippingAddress,
    orderDate,
}: OrderConfirmationEmailProps) {
    const logoUrl = "https://rkwxsjrwvooyalymhedv.supabase.co/storage/v1/object/public/apple/logo.png";

    return (
        <Html>
            <Head />
            <Preview>Order Confirmation #{orderId}</Preview>
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

                    <Text style={styles.title}>Thanks for your order, {customerName}!</Text>
                    <Text style={styles.text}>
                        We've received your order and are getting it ready. We'll notify you when it sends!
                    </Text>

                    <Section style={styles.orderInfo}>
                        <Text style={styles.orderId}>Order #{orderId}</Text>
                        <Text style={styles.orderDate}>{orderDate}</Text>
                    </Section>

                    <Hr style={styles.divider} />

                    <Section style={styles.itemsContainer}>
                        {items.map((item, index) => (
                            <Row key={index} style={styles.itemRow}>
                                <Column style={styles.itemCol}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    {item.variant && <Text style={styles.itemVariant}>{item.variant}</Text>}
                                </Column>
                                <Column style={styles.qtyCol}>
                                    <Text style={styles.itemText}>x{item.quantity}</Text>
                                </Column>
                                <Column style={styles.priceCol}>
                                    <Text style={styles.itemPrice}>₹{item.price}</Text>
                                </Column>
                            </Row>
                        ))}
                    </Section>

                    <Hr style={styles.divider} />

                    <Section style={styles.totalSection}>
                        <Row>
                            <Column>
                                <Text style={styles.totalLabel}>Total Amount</Text>
                            </Column>
                            <Column style={{ textAlign: "right" }}>
                                <Text style={styles.totalPrice}>₹{totalAmount}</Text>
                            </Column>
                        </Row>
                    </Section>

                    <Section style={styles.addressSection}>
                        <Text style={styles.addressTitle}>Shipping Address</Text>
                        <Text style={styles.addressText}>{shippingAddress}</Text>
                    </Section>

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
        color: "#1a1a1a",
        textAlign: "center" as const,
        marginBottom: "16px",
    },
    text: {
        fontSize: "16px",
        color: "#4a4a4a",
        textAlign: "center" as const,
        marginBottom: "24px",
        lineHeight: "24px",
    },
    orderInfo: {
        textAlign: "center" as const,
        marginBottom: "20px",
    },
    orderId: {
        fontSize: "18px",
        fontWeight: "600",
        color: "#333",
        margin: "0",
    },
    orderDate: {
        fontSize: "14px",
        color: "#888",
        margin: "4px 0 0",
    },
    divider: {
        borderColor: "#e6ebf1",
        margin: "20px 0",
    },
    itemsContainer: {
        width: "100%",
    },
    itemRow: {
        marginBottom: "10px",
    },
    itemCol: {
        width: "60%",
    },
    qtyCol: {
        width: "15%",
        textAlign: "center" as const,
    },
    priceCol: {
        width: "25%",
        textAlign: "right" as const,
    },
    itemName: {
        fontSize: "16px",
        fontWeight: "600",
        color: "#333",
        margin: "0",
    },
    itemVariant: {
        fontSize: "14px",
        color: "#666",
        margin: "2px 0 0",
    },
    itemText: {
        fontSize: "16px",
        color: "#333",
        margin: "0",
    },
    itemPrice: {
        fontSize: "16px",
        fontWeight: "600",
        color: "#333",
        margin: "0",
    },
    totalSection: {
        margin: "20px 0",
    },
    totalLabel: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#333",
    },
    totalPrice: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#3A6F43",
    },
    addressSection: {
        marginTop: "30px",
        backgroundColor: "#f8fafc",
        padding: "20px",
        borderRadius: "8px",
    },
    addressTitle: {
        fontSize: "14px",
        fontWeight: "700",
        color: "#555",
        textTransform: "uppercase" as const,
        marginBottom: "10px",
    },
    addressText: {
        fontSize: "15px",
        color: "#333",
        lineHeight: "22px",
    },
    footer: {
        fontSize: "12px",
        color: "#999",
        textAlign: "center" as const,
        marginTop: "20px",
        lineHeight: "18px",
    },
};
