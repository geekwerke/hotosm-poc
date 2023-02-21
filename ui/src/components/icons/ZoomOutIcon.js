import PropTypes from "prop-types";

function ZoomOutIcon({ size }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
    >
      <path fill="#fff" d="M16 7v2H0V7h16Z" />
    </svg>
  );
}

ZoomOutIcon.propTypes = {
  size: PropTypes.number,
};

ZoomOutIcon.defaultProps = {
  size: 16,
};

export default ZoomOutIcon;
