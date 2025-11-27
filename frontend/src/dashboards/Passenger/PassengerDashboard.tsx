import '../../styles/passangerdashboard.css'

import PhoneFrame from "../../components/PhoneFrame";
import rectangle from "../../assets/Rectangle 2.svg";
import profilePic from '../../assets/image 1@2x.png';
import notificationBell from '../../assets/elements.png';



export default function PassangerDashboard(){
    return(
        <PhoneFrame>
            <div style={{position: 'relative'}}>
                <div className='header-bar'>
                    {/* this div contains the component at the left(greeting, user image, user name) */}
                    <div className='header-left'>
                        {/* this div contains the avatar */}
                        <div>
                            <img
                                src={profilePic}
                                width={40}
                                height={40}
                                alt="Profile"
                            />
                        </div>
                        {/* this div contains the greeting and user name */}
                        <div style={{display: 'flex', flexDirection: 'column', lineHeight: '0px',}}>
                            <p className='welcom-greeting'>Welcom</p>
                            <p className='user-name'>Emeka D.</p>
                        </div>
                    </div>

                    {/* this component at the right is the notification icon button(notification bell) */}
                    <button
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                        }}>
                        <img src={notificationBell} alt="Notifications" />
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
                        marginTop: '62px',
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
                        <div className='safe-driving-card vehicle-detail-card'>

                        </div>

                        <div className='insurance-card vehicle-detail-card'>

                        </div>
                    </div>
                    <div className='roadworthiness-card vehicle-detail-card'>

                    </div>
                </div>

                {/* CTA Buttons(pay road taxs, scan plate no, Pay insurance etc) */}
                <div className='cta-btn-container'>
                    <div
                        className="
                        cta-btn
                        cta-pay-tax"
                        style={{
                            backgroundColor: "#023e8a80",
                        }}
                    >

                    </div>

                    <div
                        className="
                        cta-btn
                        cta-pay-insurance"
                        style={{
                            backgroundColor: "#00c8b380",
                        }}
                    >

                    </div>

                    <div
                        className="
                        cta-btn
                        cta-scan-plate"
                        style={{
                            backgroundColor: "#cb30e080",
                        }}
                        >
                            
                    </div>

                    <div
                        className="
                        cta-btn
                        cta-trcn-history"
                        style={{
                            backgroundColor: "rgba(0, 136, 255, 0.5)",
                        }}
                    >

                    </div>
                    
                </div>
            </div>
        </PhoneFrame>
    )
}