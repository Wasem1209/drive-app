import { useState } from "react";
import "../../styles/profile.css"; // optional shared styles
import PhoneFrame from "../../../components/PhoneFrame";

function VehicleInfo() {
    const [vehicleData, setVehicleData] = useState({
        plateNumber: "",
        manufacturer: "",
        model: "",
        year: "",
        color: "",
    });

    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        setVehicleData({
            ...vehicleData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaved(false);

        try {
            // TODO: Replace with backend API call
            // await updateVehicleInfo(vehicleData);

            setTimeout(() => {
                setIsSaving(false);
                setSaved(true);
            }, 1500);
        } catch (err) {
            console.error(err);
            setIsSaving(false);
        }
    };

    return (
        <div className="profile-section-card">
            <h3 className="section-title">Vehicle Information</h3>

            <form className="form-grid" onSubmit={handleSubmit}>
                {/* Plate Number */}
                <div className="form-group">
                    <label>Plate Number</label>
                    <input
                        type="text"
                        name="plateNumber"
                        placeholder="Enter Plate Number"
                        value={vehicleData.plateNumber}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Manufacturer */}
                <div className="form-group">
                    <label>Manufacturer</label>
                    <input
                        type="text"
                        name="manufacturer"
                        placeholder="e.g., Toyota"
                        value={vehicleData.manufacturer}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Model */}
                <div className="form-group">
                    <label>Vehicle Model</label>
                    <input
                        type="text"
                        name="model"
                        placeholder="e.g., Corolla"
                        value={vehicleData.model}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Year */}
                <div className="form-group">
                    <label>Year</label>
                    <input
                        type="number"
                        name="year"
                        placeholder="2020"
                        value={vehicleData.year}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Color */}
                <div className="form-group">
                    <label>Color</label>
                    <input
                        type="text"
                        name="color"
                        placeholder="Black, White, Gray..."
                        value={vehicleData.color}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="save-btn"
                    disabled={isSaving}
                >
                    {isSaving ? "Updating..." : "Save Vehicle Info"}
                </button>

                {saved && (
                    <p className="success-text">Vehicle information updated successfully.</p>
                )}
            </form>
        </div>
    );
}

export default VehicleInfo;
