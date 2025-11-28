import '../../styles/driverdashboard.css'

import PhoneFrame from "../../components/PhoneFrame";
import rectangle from "../../assets/Rectangle 2.svg";
import profilePic from '../../assets/image 1@2x.png';
import notificationBell from '../../assets/elements.png';
import eye_icon from '../../assets/Eye.png';
import streakImage from '../../assets/Group 43.png';
import check_icon from '../../assets/Frame 34.png';
import gift_icon from '../../assets/Frame 35.png';
import copy_icon from '../../assets/Copy.png';
import chevron_left_sqr from '../../assets/chevron-left-square.png';
import scanPlateIcon from '../../assets/scan plate img.png'
import payTpFareIcon from '../../assets/payTpIcon.png'
import reportDriverIcon from '../../assets/ReportDriverIcon.png'
import transaction_history from '../../assets/transactionHst.png'

export default function DriverDashboard(){
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
                                style={{cursor: "pointer"}}
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
                        <img src={notificationBell}/>
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
                    <div>
                        <div className='small-txt'>
                            <p style={{margin: "0px"}}>Available Balance</p>
                            <img
                                src={eye_icon}
                                alt="Eye Icon"
                                style={{
                                    width: '12px',
                                    height: '12px',
                                    paddingTop: '15px',
                                    paddingLeft: '8px',
                                    paddingBottom: '12px',
                                    cursor: 'pointer',
                                }}
                            />
                        </div>

                        <h2 className='wallet-amount'>₦10,000.00</h2> 
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                cursor: 'pointer',
                            }}
                        >
                            <img
                                src={copy_icon}
                                alt="Copy Icon"
                            />
                            <h3 className="wallet-id small-txt">Wallet Id: 001123983</h3>
                        </div>
                    </div>
                     

                  <button className="connect-wallet-btn">Connect Wallet</button>  
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
                        <div>
                            <p
                                className="streak-weeks-num"
                                style={{paddingTop: "20px"}}
                            >3</p>
                            <p className="streak-label">Days <br></br>Streak</p>
                        </div>

                        <img
                            src={streakImage}
                            style={{
                                width: "50px",
                                height: "70px",
                                marginTop:"auto",
                                marginLeft: "1px"
                            }}
                        />
                    </div>

                    <div
                        className='weekly-streak-card'
                    >   
                            <p className="weekly-title" style={{textAlign:'left'}}>Daily Reward</p>

                        <div className="week-dots">
                            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day, index)=> (
                            <div className="day-item" key={day}>
                                <img src={index === 6 ? gift_icon : check_icon}/>
                                <span>{day}</span>
                            </div>
                         ))}
                        </div>
                    </div>
                </div>
            
                {/* CTA Buttons(pay road taxs, scan plate no, Pay insurance etc) */}
                <div className='cta-btn-container'>
                    <div
                        className="cta-btn cta-pay"
                        style={{
                            backgroundColor: "rgba(52, 199, 89, 0.5)",
                            position: 'relative',
                        }}
                    >
                        <p>Scan <br />& Verify</p>
                        <img
                            src={chevron_left_sqr}
                            className='cta-chv-btn'
                        />
                        <div
                            className='cta-img-container'
                            style={{left: '90px', top: '50px'}}
                        >
                            <img src={scanPlateIcon}/>
                        </div>
                        
                    </div>

                    <div
                        className="cta-btn cta-pay"
                        style={{
                            backgroundColor: "rgba(0, 200, 179, 0.5)",
                            position: 'relative',
                        }}
                    >
                        <p>Pay  <br />TP Fare</p>
                        <img
                            src={chevron_left_sqr}
                            className='cta-chv-btn'
                        />
                        <div
                            className='cta-img-container'
                            style={{left: '78px', top: '80px'}}
                        >
                            <img src={payTpFareIcon}/>
                        </div>
                    </div>

                    <div
                        className="cta-btn cta-pay"
                        style={{
                            backgroundColor: "rgba(234, 106, 106, 0.5)",
                            position: 'relative',
                        }}
                    >
                            <p>Report <br />Driver</p>
                            <img
                                src={chevron_left_sqr}
                                className='cta-chv-btn'
                            />
                            <div
                                className='cta-img-container'
                                style={{left: '90px', top: '70px'}}
                            >
                                <img src={reportDriverIcon}/>
                            </div>
                    </div>

                    <div
                        className="cta-btn cta-pay"
                        style={{
                            backgroundColor: "rgba(0, 136, 255, 0.5)",
                            position: 'relative',
                        }}
                    >
                        <p>Payment <br />History</p>
                        <img
                            src={chevron_left_sqr}
                            className='cta-chv-btn'
                        />
                        <div
                            className='cta-img-container'
                            style={{left: '100px', top: '70px'}}
                        >
                            <img src={transaction_history}/>
                        </div>
                    </div>
                    
                </div>
            </div>
        </PhoneFrame>
    )
}