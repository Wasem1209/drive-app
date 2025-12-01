import { FaChevronRight } from 'react-icons/fa';
import due_icon from '../assets/alarm.png';

function DueNotification() {
    return(
        <div className="due-notification-container">
            {/* Due notification content goes here */}
            <Notification />
            <Notification />
            <Notification />
        </div>
    )
}

function Notification(){
    // this component represents a single due notification card
    // You can customize the content and styling as needed
    return(
        <div className="due-notification-card">
            <img src={due_icon} alt="Warning Icon" />
            <div className="due-notification-content">
                <h3
                    style={{
                        margin: "0px",
                        fontWeight: "800",
                        fontFamily: "quicksand",
                        fontSize: "12px",
                        paddingLeft: "4px",
                    }}
                >
                    Insurance Almost Due
                </h3>
                <p className="due-date-text">
                    Your Vehicle’s insurance renewal is almost due.
                </p>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "12px",
                    }}
                >
                    <p className='due-date-text due-days'>Due: 10 days</p>
                    <p className='due-date-text renew-btn'>
                        Renew
                        <FaChevronRight />
                    </p>
                </div>
            </div>
        </div>
    )
}

export default DueNotification;