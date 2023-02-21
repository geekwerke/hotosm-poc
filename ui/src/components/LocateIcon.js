import PropTypes from "prop-types";

function LocateIcon({ size }) {
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
      <path fill="#fff" d="M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0Z" />
      <path fill="#596b78" d="M13 8A5 5 0 1 1 3 8a5 5 0 0 1 10 0Z" />
      <path fill="#fff" d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
    </svg>
  );
}

LocateIcon.propTypes = {
  size: PropTypes.number,
};

LocateIcon.defaultProps = {
  size: 16,
};

export default LocateIcon;
