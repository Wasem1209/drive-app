import VehicleVerifyModal from '../../Passenger/features/VehicleVerifyModal';

export default function ScanPlateNo(props) {
    // Reuse the Passenger `VehicleVerifyModal` so the Driver flow matches exactly.
    return <VehicleVerifyModal {...props} />;
}