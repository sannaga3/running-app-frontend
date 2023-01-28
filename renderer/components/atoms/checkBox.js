const CheckBox = ({
  name,
  register,
  checkable,
  selected,
  setSelected,
  wrapperClassProp = null,
  inputClassProp = null,
  labelClassProp = null,
}) => {
  const wrapperStyle = wrapperClassProp ? wrapperClassProp : "flex";
  const inputStyle = inputClassProp
    ? inputClassProp
    : "mx-2 mb-1.5 bg-slate-400";
  const labelStyle = labelClassProp ? labelClassProp : "text-black";

  const handleChange = (value) => {
    if (selected.includes(value)) {
      const deleted = selected.filter((item) => item !== value);
      return setSelected(deleted);
    }
    return setSelected([...selected, value]);
  };

  return (
    <div className={wrapperStyle}>
      {checkable.map((item) => (
        <div key={item.value} className="flex items-center">
          <input
            name={name}
            {...register(name)}
            type="checkbox"
            value={item.value}
            onChange={() => handleChange(item.value)}
            checked={
              selected.length > 0 && selected.includes(item.value)
                ? "checked"
                : false
            }
            className={inputStyle}
          />
          <label htmlFor={item.value} className={labelStyle}>
            {item.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default CheckBox;
