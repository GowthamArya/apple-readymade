"use client";
import { useEffect, useState } from "react";

export default function Auth() {
    const [mode, setMode] = useState<"login" | "signup">("login");

    useEffect(() => {
        document.title = `${mode === "login" ? "Login" : "Sign Up"} - Apple Readymade & More.`;
    }, [mode]);

    const formFields = {
        login: [
            { label: "Email", type: "email", name: "email" },
            { label: "Password", type: "password", name: "password" },
        ],
        signup: [
            { label: "Full Name", type: "text", name: "name" },
            { label: "Email", type: "email", name: "email" },
            { label: "Password", type: "password", name: "password" },
        ],
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <div className="flex justify-around mb-6">
                    {["login", "signup"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setMode(type as "login" | "signup")}
                            className={`px-4 py-2 font-semibold capitalize ${
                                mode === type
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-500"
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
                <AuthForm fields={formFields[mode]} mode={mode} />
            </div>
        </div>
    );
}

function AuthForm({
    fields,
    mode,
}: {
    fields: { label: string; type: string; name: string }[];
    mode: "login" | "signup";
}) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Add logic to handle submit
        alert(`${mode === "login" ? "Logging in" : "Signing up"}...`);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
                <div key={field.name}>
                    <label className="block text-gray-700">{field.label}</label>
                    <input
                        type={field.type}
                        name={field.name}
                        required
                        className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={field.label}
                    />
                </div>
            ))}
            <button
                type="submit"
                className={`w-full ${
                    mode === "login" ? "bg-blue-600" : "bg-green-600"
                } text-white py-2 rounded-md hover:opacity-90 transition`}
            >
                {mode === "login" ? "Login" : "Sign Up"}
            </button>
        </form>
    );
}
