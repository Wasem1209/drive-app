// IdentitySection.jsx
import React, { useState, useEffect } from "react";

export default function IdentitySection({ profile = {}, onSave, setError, setLoading }) {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        licenseNumber: "",
        licenseExpiry: "",
        vehiclePlate: "",
        vehicleModel: "",
        vehicleYear: "",
        vehicleType: "",
    });
    const [, setDocs] = useState({
        licenseFile: null, insuranceFile: null, roadworthyFile: null, idFile: null,
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (profile) setForm(prev => ({ ...prev, ...profile }));
    }, [profile]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setSaved(false);
    }

    function handleFileChange(e, key) {
        const file = e.target.files?.[0] || null;
        setDocs(prev => ({ ...prev, [key]: file }));
    }


    async function handleSave() {
        setLoading(true); setError(""); setSaved(false);
        try {
            const res = await fetch("/api/driver/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("Profile save failed");
            const updated = await res.json();
            onSave(updated);
            setSaved(true);
        } catch (e) {
            console.error(e);
            setError(e.message || "Save failed");
        } finally { setLoading(false); }
    }

    return (
        <section className="card">
            <h3>Driver Identity</h3>
            <div className="form-grid">
                <label>Full Name<input name="fullName" value={form.fullName} onChange={handleChange} /></label>
                <label>Email<input name="email" value={form.email} onChange={handleChange} /></label>
                <label>Phone<input name="phone" value={form.phone} onChange={handleChange} /></label>
                <label>Address<input name="address" value={form.address} onChange={handleChange} /></label>
                <label>License Number<input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} /></label>
                <label>License Expiry<input type="date" name="licenseExpiry" value={form.licenseExpiry} onChange={handleChange} /></label>

                <h4>Vehicle</h4>
                <label>Plate<input name="vehiclePlate" value={form.vehiclePlate} onChange={handleChange} /></label>
                <label>Model<input name="vehicleModel" value={form.vehicleModel} onChange={handleChange} /></label>
                <label>Year<input name="vehicleYear" value={form.vehicleYear} onChange={handleChange} /></label>
                <label>Type<input name="vehicleType" value={form.vehicleType} onChange={handleChange} /></label>

                <h4>Documents</h4>
                <label>Driver's License<input type="file" onChange={(e) => handleFileChange(e, "licenseFile")} /></label>
                <label>Insurance<input type="file" onChange={(e) => handleFileChange(e, "insuranceFile")} /></label>
                <label>Roadworthy<input type="file" onChange={(e) => handleFileChange(e, "roadworthyFile")} /></label>
                <label>ID (NIN)<input type="file" onChange={(e) => handleFileChange(e, "idFile")} /></label>
            </div>

            <div className="actions">
                <button onClick={handleSave}>Save Profile</button>
                {saved && <span className="ok">Saved</span>}
            </div>
        </section>
    );
}
