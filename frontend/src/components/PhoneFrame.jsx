import "../styles/phone-frame.css";

// Usage: wrap any page content inside <PhoneFrame> to render it on the mock phone screen.
// <PhoneFrame pageClassName="custom-page" contentClassName="custom-content">...</PhoneFrame>

// Shows page content inside a fake phone so designs look like a mobile screen.
export default function PhoneFrame({
  children,
  pageClassName = "driver-page",
  contentClassName = "",
}) {
  // Merge the default screen style with any extra classes the caller passes in.
  const contentClasses = ["screen-content", contentClassName].filter(Boolean).join(" ");

  return (
    // Page wrapper so each screen can change its backdrop if needed.
    <section className={pageClassName}>
      <div className="device-frame">
        <div className="antenna-lines" aria-hidden="true" />
        <div className="screen-mask">
          {/* Mimics the iPhone cutout for speaker and camera. */}
          <div className="dynamic-island" aria-hidden="true">
            <span className="dynamic-speaker" />
            <span className="dynamic-camera" />
          </div>
          {/* Real page content sits here inside the phone frame. */}
          <div className={contentClasses}>{children}</div>
        </div>
      </div>
    </section>
  );
}
