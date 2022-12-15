const button = ({ text, type, onclick, color, width, height }) => {
  const size = { width: width, height: height };

  return (
    <button
      onClick={onclick}
      type={type}
      style={size}
      className={`btn btn-${color}`}
    >
      {text}
    </button>
  );
};

export default button;
