import React, { useState } from "react";

export default function Profile({ profile, setProfile }) {
    const [form, setForm] = useState({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
    });

    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setSaved(false);
    }

    async function handleSave() {
        setLoading(true);
        setSaved(false);

        try {
            const res = await fetch("/api/driver/profile/updatePersonalInfo", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                // Update parent profile state
                setProfile((prev) => ({ ...prev, ...form }));
                setSaved(true);
            } else {
                console.error("Update failed:", data.message);
            }
        } catch (err) {
            console.error("Update error:", err);
        }

        setLoading(false);
    }

    return (
        <div className="bg-surface p-lg shadow-md rounded-lg">
            <h3 className="text-lg font-semibold mb-md">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">

                {/* Full Name */}
                <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        className="input w-full mt-xs"
                        placeholder="Enter full name"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="text-sm font-medium">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="input w-full mt-xs"
                        placeholder="Enter email address"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="text-sm font-medium">Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="input w-full mt-xs"
                        placeholder="Enter phone number"
                    />
                </div>

                {/* Address */}
                <div>
                    <label className="text-sm font-medium">Home Address</label>
                    <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="input w-full mt-xs"
                        placeholder="Enter home address"
                    />
                </div>
            </div>

            {/* Save Button */}
            <div className="mt-lg">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary px-lg py-sm rounded-md"
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>

                {saved && (
                    <span className="ml-md text-success text-sm">
                        ✔ Profile updated successfully
                    </span>
                )}
            </div>
        </div>
    );
}
