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
        </div>
    )
}

export default DueNotification;