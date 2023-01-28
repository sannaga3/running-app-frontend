const Button = ({
  text,
  type,
  onClick,
  color,
  width,
  height,
  textSize = "md",
  useDefaultClass = true,
  classProps = "",
  disabled = "",
}) => {
  const size = { width: width, height: height };

  const buttonStyle = useDefaultClass
    ? `btn btn-${color} text-${textSize} ${classProps}`
    : classProps;

  return (
    <button
      onClick={onClick}
      type={type}
      style={size}
      className={buttonStyle}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
