const SelectBox = ({
  label,
  name,
  selectableValues,
  handleSelect,
  selectedValues = [],
  selectedValue = null,
  wrapperStyleProp = null,
  labelStyleProp = null,
  selectStyleProp = null,
  optionStyleProp = null,
}) => {
  const labelStyle = labelStyleProp ?? "border-b-2 border-gray-600";
  const selectStyle = selectStyleProp ?? "w-full bg-gray-300";
  const optionStyle = optionStyleProp ?? "focus:outline-none";

  const handleDisabled = (column) => {
    const targetIndex = selectedValues.filter(
      (item) => Object.keys(item)[0] === column
    );

    if (targetIndex.length > 0) return "disabled";
    return false;
  };

  return (
    <div
      className={
        wrapperStyleProp
          ? wrapperStyleProp
          : "col-span-2 border-2 border-gray-600"
      }
      key={label}
    >
      <div className={labelStyle}>{label}</div>
      <select
        name={name}
        onChange={(e) => handleSelect(e.target.value, label)}
        className={selectStyle}
        defaultValue={selectedValue}
      >
        {selectableValues.map((value) => {
          return (
            <option
              value={value}
              key={value}
              className={optionStyle}
              disabled={selectedValues && handleDisabled(value)}
            >
              {value}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SelectBox;
