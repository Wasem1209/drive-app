import '../../styles/driverdashboard.css'
import PhoneFrame from "../../components/PhoneFrame";
import rectangle from "../../assets/rectangle.svg";
import DueNotification from '../../components/DueNotification';

export default function DriverDashboard(){
    return(
        <PhoneFrame>
            <div>
                <div className='header-bar'>
                    {/* this div contains the component at the left(greeting, user image, user name) */}
                    <div className='header-left'>
                        {/* this div contains the avatar */}
                        <div>
                            <img />
                        </div>
                        {/* this div contains the greeting and user name */}
                        <div>
                            <p>Welcom</p>
                            <p>Emeka D.</p>
                        </div>
                    </div>

                    {/* this component at the right is the notification icon button(notification bell) */}
                    <button>
                        <img />
                    </button>

                </div>
                <img
                    src={rectangle}
                    alt="Rectangle"
                    style={{
                        width: '100%',
                        height: 'auto',
                    }} 
                />

                {/* wallet */}
                <div
                    className="wallet"
                >
                    
                </div>

                {/* Weekly goal(streak) section */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        marginTop: '82px',
                        paddingInline: '20px',
                    }}
                >
                    <div className='streak-card'>

                    </div>

                    <div
                        className='weekly-streak-card'
                    >

                    </div>
                </div>
            
                {/* Due Warning sections */}
                <div>
                    <DueNotification />
                </div>
            
                {/* Car Details(roadworthiness, insurance, etc) section */}
                <div className='vehicle-details-section'>

                    {/* 
                        this seperates the two shorter cards from the longer
                        one(car roadworthiness) cards on the right side
                    */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                        }}
                    >
                        <div className='safe-driving-card   '>

                        </div>

                        <div className='safe-driving-card vehicle-detail-card'>

                        </div>

                        <div className='insurance-card vehicle-detail-card'>

                        </div>
                    </div>
                    <div className='roadworthiness-card vehicle-detail-card'>

                    </div>
                </div>
            </div>
        </PhoneFrame>
    )
}