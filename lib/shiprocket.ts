
const SHIPROCKET_API_URL = "https://apiv2.shiprocket.in/v1/external";

export async function getShiprocketToken() {
    const email = process.env.SHIPROCKET_EMAIL;
    let password = process.env.SHIPROCKET_PASSWORD;
    console.log("password: ", password);
    if (!email || !password) {
        throw new Error("Shiprocket credentials missing (SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD)");
    }

    try {
        const response = await fetch(`${SHIPROCKET_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to login to Shiprocket");
        }

        return data.token;
    } catch (error: any) {
        console.error("Shiprocket Auth Error:", error);
        throw error;
    }
}

export interface ShiprocketOrderItem {
    name: string;
    sku: string;
    units: number;
    selling_price: number;
    discount?: number;
    tax?: number;
    hsn?: string;
}

export interface CreateShiprocketOrderParams {
    order_id: string;
    order_date: string;
    pickup_location: string;
    billing_customer_name: string;
    billing_last_name: string;
    billing_address: string;
    billing_address_2?: string;
    billing_city: string;
    billing_pincode: string;
    billing_state: string;
    billing_country: string;
    billing_email: string;
    billing_phone: string;
    shipping_is_billing: boolean;
    order_items: ShiprocketOrderItem[];
    payment_method: "Prepaid" | "COD";
    shipping_charges?: number;
    giftwrap_charges?: number;
    transaction_charges?: number;
    total_discount?: number;
    sub_total: number;
    length: number;
    width: number;
    height: number;
    weight: number;
    breadth: number;
}

export async function createShiprocketOrder(params: CreateShiprocketOrderParams) {
    const token = await getShiprocketToken();

    try {
        const response = await fetch(`${SHIPROCKET_API_URL}/orders/create/adhoc`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(params),
        });
        const data = await response.json();

        if (!response.ok) {
            console.error("Shiprocket Order Creation API Error:", data);
            const errorMessage = data.message || (data.errors ? JSON.stringify(data.errors) : "Failed to create Shiprocket order");
            throw new Error(errorMessage);
        }

        return data;
    } catch (error: any) {
        console.error("Shiprocket Request Error:", error);
        throw error;
    }
}

export async function getShiprocketTracking(shipmentId: string) {
    const token = await getShiprocketToken();

    try {
        const response = await fetch(`${SHIPROCKET_API_URL}/courier/track/shipment/${shipmentId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch tracking info");
        }

        return data;
    } catch (error: any) {
        console.error("Shiprocket Tracking Error:", error);
        throw error;
    }
}

export async function getShiprocketRates(params: {
    pickup_pincode: string;
    delivery_pincode: string;
    weight: number;
    cod: 0 | 1;
}) {
    const token = await getShiprocketToken();

    try {
        const url = new URL(`${SHIPROCKET_API_URL}/courier/serviceability/`);
        url.searchParams.append("pickup_postcode", params.pickup_pincode);
        url.searchParams.append("delivery_postcode", params.delivery_pincode);
        url.searchParams.append("weight", params.weight.toString());
        url.searchParams.append("cod", params.cod.toString());

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch shipping rates");
        }

        return data;
    } catch (error: any) {
        console.error("Shiprocket Rates Error:", error);
        throw error;
    }
}

export async function getShiprocketPincodeDetails(pincode: string) {
    const token = await getShiprocketToken();

    try {
        const url = new URL(`${SHIPROCKET_API_URL}/courier/serviceability/`);
        // We use a dummy pickup postcode just to get the delivery details
        url.searchParams.append("pickup_postcode", process.env.SHIPROCKET_PICKUP_PINCODE || "508207");
        url.searchParams.append("delivery_postcode", pincode);
        url.searchParams.append("weight", "0.5");
        url.searchParams.append("cod", "0");

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch pincode details");
        }

        // The serviceability API returns city and state if valid
        if (data.data && data.data.available_courier_companies && data.data.available_courier_companies.length > 0) {
            const first = data.data.available_courier_companies[0];
            return {
                city: first.city || data.data.delivery_city,
                state: first.state || data.data.delivery_state,
                country: "India"
            };
        }

        // Sometimes it's in a different place
        if (data.data?.delivery_city) {
            return {
                city: data.data.delivery_city,
                state: data.data.delivery_state,
                country: "India"
            };
        }

        throw new Error("Pincode not serviceable or invalid");
    } catch (error: any) {
        console.error("Shiprocket Pincode Error:", error);
        throw error;
    }
}

export async function cancelShiprocketOrder(orderIds: string[]) {
    const token = await getShiprocketToken();

    try {
        const response = await fetch(`${SHIPROCKET_API_URL}/orders/cancel`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ids: orderIds }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to cancel Shiprocket order");
        }

        return data;
    } catch (error: any) {
        console.error("Shiprocket Cancel Error:", error);
        throw error;
    }
}

