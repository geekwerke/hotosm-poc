import PropTypes from "prop-types";

function ZoomInIcon({ size }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
    >
      <path fill="#fff" d="M7 0h2v16H7V0Z" />
      <path fill="#fff" d="M16 7v2H0V7h16Z" />
    </svg>
  );
}

ZoomInIcon.propTypes = {
  size: PropTypes.number,
};

ZoomInIcon.defaultProps = {
  size: 16,
};

export default ZoomInIcon;
