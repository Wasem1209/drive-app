import '../../styles/driverdashboard.css'

import PhoneFrame from "../../components/PhoneFrame";
import rectangle from "../../assets/Rectangle 2.svg";
import DueNotification from '../../components/DueNotification';
import profilePic from '../../assets/image 1@2x.png';
import notificationBell from '../../assets/elements.png';
import eye_icon from '../../assets/Eye.png';
import check_icon from '../../assets/Frame 34.png';
import gift_icon from '../../assets/Frame 35.png';
import bell_icon from '../../assets/alarm.png';
import arrow from '../../assets/Chevron right.png';
import rating from '../../assets/Frame 75.png';
import insurance_text from '../../assets/Frame 70.png';
import car_side_view from '../../assets/car side view.png';
import frame_71 from '../../assets/Frame 71.png';
import rw_text from '../../assets/Frame 73.png';
import car_front_view from '../../assets/car front view.png';
import frame_72 from '../../assets/Frame 72.png';
import copy_icon from '../../assets/Copy.png';
import chevron_left_sqr from '../../assets/chevron-left-square.png';
import pay_tax_img from '../../assets/pay-tax-img.png'
import scan_plate_img from '../../assets/scan plate img.png'
import pay_insurance_history from '../../assets/pay_insurance_history_img.png'

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
                    <div className='small-txt'>
                        <p>Available Balance</p>
                        <img
                        src={eye_icon}
                        alt="Eye Icon"
                        style={{
                        width: '12px',
                        height: '12px',
                        paddingTop: '15px',
                        paddingLeft: '8px',
                        paddingBottom: '12px',
                        }}/>
                    </div>

                     <h2 className='wallet-amount'>₦10,000.00</h2> 
                     <div>
                        <img src={copy_icon} alt="Copy Icon"/>
                        <h3 className="wallet-id small-txt">Wallet Id: 001123983</h3>
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
                        <p className="streak-weeks">3 Weeks</p>
                        <p className="streak-label">Safe <br></br>Driving</p>
                    </div>

                    <div
                        className='weekly-streak-card'
                    >   
                            <p className="weekly-title" style={{textAlign:'left'}}>Weekly Goal</p>

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
                    <div className='due-notification-card'>
                        <div style={{display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}>
                                <img src={bell_icon}/>
                                <h4> Insurance Almost Due</h4>
                        </div>
                        <p>Your Vehicle’s insurance renewal is almost due.</p>
                        
                        <div className="due-footer">
                            <span>Due: 10 days</span>
                            <div>
                                <span style={{cursor:'pointer'}}>Renew</span>
                                <img src={arrow}/>
                            </div>
                        </div>
                    </div>
                    <div className='due-notification-card'>
                        <div style={{display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    }}>
                                    <img src={bell_icon}/>
                                <h4>Licence Almost Due</h4>
                        </div>    
                        <p>Your Vehicle's Licence Renewal is almost due.</p>
                        <div className="due-footer">
                            <span>Due: 10 days</span>
                            <div>
                             <span style={{cursor:'pointer'}}>Renew</span>
                             <img src={arrow}/>
                            </div>
                        </div>
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
                            <p className="sd-title">Safe Driving</p>
                            <p className="sd-subtitle">Your Weekly safe <br></br>driving score</p>
                            <img style={{paddingLeft:'50px'}} src={rating} alt="Rating" />

                        </div>
                        
                        <div className='insurance-card vehicle-detail-card'>
                            <img src={insurance_text} />
                            <div style={{position:'relative', 
                                        left:'45px', 
                                        top:'5px'
                                        }}>
                             <img src={car_side_view} />
                            </div>
                            <div style={{position:'absolute', 
                                        zIndex:'5', 
                                        top:'110px'
                                        }}>
                            <img src={frame_71}/>
                            </div>
                        </div>
                    </div>
                    <div className='roadworthiness-card vehicle-detail-card'>
                        <img src={rw_text}/>
                        <div
                            style={{position:'relative', 
                                    left:'35px', 
                                    top:'2px'
                                    }}>
                             <img src={car_front_view} />
                        </div>
                        <div style={{position:'absolute', 
                                    zIndex:'5', 
                                    top:'270px'
                                    }}>
                            <img src={frame_72}/>
                        </div>
                    </div>
                </div>

                {/* CTA Buttons(pay road taxs, scan plate no, Pay insurance etc) */}
                <div className='cta-btn-container'>
                    <div
                        className="
                        cta-btn
                        cta-pay"
                        style={{
                            backgroundColor: "#023e8a80",
                        }}
                    >
                        <p>Pay Road <br></br>Tax</p>
                        <img src={chevron_left_sqr}/>
                        <div style={{
                                    position:'relative', 
                                    top:'-60px', 
                                    left:'40px'
                                    }}>
                            <img src={pay_tax_img}/>
                        </div>
                        

                    </div>

                    <div
                        className="
                        cta-btn
                        cta-pay"
                        style={{
                            backgroundColor: "#00c8b380",
                        }}
                    >
                        <p>Scan <br></br>Plate No.</p>
                        <img src={chevron_left_sqr}/>
                        <div style={{
                                    position:'relative', 
                                    top:'-70px', 
                                    left:'60px'
                                    }}>
                            <img src={scan_plate_img}/>
                        </div>
                    </div>

                    <div
                        className="
                        cta-btn
                        cta-pay"
                        style={{
                            backgroundColor: "#cb30e080",
                        }}
                        >
                            <p>Pay<br></br>Insurance</p>
                            <img src={chevron_left_sqr}/>
                            <div style={{
                                        position:'relative', 
                                        top:'-65px', 
                                        left:'40px'
                                        }}>
                                <img src={pay_insurance_history}/>
                            </div>
                    </div>

                    <div
                        className="
                        cta-btn
                        cta-pay"
                        style={{
                            backgroundColor: "rgba(0, 136, 255, 0.5)",
                        }}
                    >
                        <p>Payment<br></br>History</p>
                        <img src={chevron_left_sqr}/>
                        <div style={{
                                    position:'relative', 
                                    top:'-65px', 
                                    left:'40px'
                                    }}>
                            <img src={pay_insurance_history}/>
                        </div>
                    </div>
                    
                </div>
            </div>
        </PhoneFrame>
    )
}