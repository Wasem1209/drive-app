import '../../styles/driverdashboard.css'

import PhoneFrame from "../../components/PhoneFrame";
import rectangle from "../../assets/Rectangle 2.svg";
import DueNotification from '../../components/DueNotification';
import profilePic from '../../assets/image 1@2x.png';
import notificationBell from '../../assets/elements.png';
import eye_icon from '../../assets/Eye.png';
import streakImage from '../../assets/Group 43.png';
import check_icon from '../../assets/Frame 34.png';
import goodIcon from '../../assets/check.png'
import gift_icon from '../../assets/Frame 35.png';
import calender from '../../assets/calender.png'
import closeIcon from '../../assets/clsoeIcon.png'
import rating from '../../assets/Frame 75.png';
import carSideView from '../../assets/car side view.png';
import frame_71 from '../../assets/Frame 71.png';
import carFrontView from '../../assets/car front view.png';
import frame_72 from '../../assets/Frame 72.png';
import copy_icon from '../../assets/Copy.png';
import chevron_left_sqr from '../../assets/chevron-left-square.png';
import pay_tax_img from '../../assets/pay-tax-img.png'
import scan_plate_img from '../../assets/scan plate img.png'
import pay_insurance_history from '../../assets/pay_insurance_history_img.png'
import transaction_history from '../../assets/transactionHst.png'
import ConnectWallet from './features/ConnectWallet';

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
                     

                  <ConnectWallet />  
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
                            <div style={{
                                display: "flex",
                                alignItems: "end",
                                paddingTop: "20px", 
                            }}>
                                <p className="streak-weeks-num">3</p>
                                <p className="streak-weeks">Weeks</p>
                            </div>
                            <p className="streak-label">Safe <br></br>Driving</p>
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
                            <p className="weekly-title" style={{textAlign:'left'}}>Weekly Reward</p>

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
            
                {/* Due Warning sections */}
                <div className="due-notification-container">
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
                            gap: '10px'
                        }}
                    >
                        <div className='safe-driving-card vehicle-detail-card'>
                            <p className="sd-title">Safe Driving</p>
                            <p className="sd-subtitle">Your Weekly safe <br></br>driving score</p>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "end",
                                    justifyContent: "center",
                                    marginRight: "12px",
                                    width: "100%",
                                }}
                            >
                                <p className='driving-score score-percent typ-page-title'>75</p>
                                <p className='driving-score score-total'>/100</p>
                            </div>
                        </div>
                        
                        <div className='insurance-card vehicle-detail-card'>
                            <p className="sd-title">Insurance</p>
                            <p className="sd-subtitle">Your Vehicle’s insurance <br />is Due</p>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "end",
                                    marginTop: 'auto',
                                    paddingBottom: "15px",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    zIndex: "2"
                                }}
                            >
                                <p
                                    className='due-days-left'
                                >
                                    <img src={calender} />
                                    Due: 10 Jan 2025
                                </p>
                                <img
                                    style={{paddingRight: "18px",}}
                                    src={closeIcon}
                                />
                            </div>
                            <img
                                src={carSideView}
                                className='car-side-view'
                            />
                        </div>
                    </div>
                    <div className='roadworthiness-card vehicle-detail-card'>
                        <p className="road-worthy-stat">Roadworthy</p>
                        <p className="road-worthy-user-stat">Your Vehicle is roadworthy </p>
                            <img
                                src={carFrontView}
                                style={{
                                    marginLeft: "55px"
                                }}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "end",
                                    marginTop: 'auto',
                                    paddingBottom: "15px",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    zIndex: "2"
                                }}
                            >
                                <p
                                    className='due-days-left'
                                >
                                    <img src={calender} />
                                    Due: 13 Dec 2026
                                </p>
                                <img
                                    style={{paddingRight: "12px",}}
                                    src={goodIcon}
                                />
                            </div>
                    </div>
                </div>

                {/* CTA Buttons(pay road taxs, scan plate no, Pay insurance etc) */}
                <div className='cta-btn-container'>
                    <div
                        className="cta-btn cta-pay"
                        style={{
                            backgroundColor: "#023e8a80",
                            position: 'relative',
                        }}
                    >
                        <p>Pay Road <br></br>Tax</p>
                        <img
                            src={chevron_left_sqr}
                            className='cta-chv-btn'
                        />
                        <div
                            className='cta-img-container'
                            style={{left: '70px', top: '80px'}}
                        >
                            <img src={pay_tax_img}/>
                        </div>
                        
                    </div>

                    <div
                        className="cta-btn cta-pay"
                        style={{
                            backgroundColor: "#00c8b380",
                            position: 'relative',
                        }}
                    >
                        <p>Scan <br />Plate No.</p>
                        <img
                            src={chevron_left_sqr}
                            className='cta-chv-btn'
                        />
                        <div
                            className='cta-img-container'
                            style={{left: '90px', top: '60px'}}
                        >
                            <img src={scan_plate_img}/>
                        </div>
                    </div>

                    <div
                        className="cta-btn cta-pay"
                        style={{
                            backgroundColor: "#cb30e080",
                            position: 'relative',
                        }}
                    >
                            <p>Pay<br />Insurance</p>
                            <img
                                src={chevron_left_sqr}
                                className='cta-chv-btn'
                            />
                            <div
                                className='cta-img-container'
                                style={{left: '70px', top: '70px'}}
                            >
                                <img src={pay_insurance_history}/>
                            </div>
                    </div>

                    <div
                        className="cta-btn cta-pay"
                        style={{
                            backgroundColor: "rgba(0, 136, 255, 0.5)",
                            position: 'relative',
                        }}
                    >
                        <p>Payment<br />History</p>
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