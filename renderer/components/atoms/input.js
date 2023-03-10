const Input = ({
  label,
  isNotLabel = false,
  name,
  type,
  step = null,
  min,
  max,
  register,
  required = false,
  minLen,
  maxLen,
  getValues,
  getValueKey,
  trigger = null,
  wrapperClassProp = null,
  labelClassProp = null,
  inputClassProp = null,
  labelSize = "200px",
  inputSize = "200px",
}) => {
  const labelWidth = { width: labelSize };
  const inputWidth = { width: inputSize };

  return (
    <div
      className={
        wrapperClassProp ? wrapperClassProp : "flex items-center space-y-3"
      }
    >
      {!isNotLabel && (
        <label
          className={labelClassProp ? labelClassProp : "text-lg mt-3.5"}
          style={labelWidth}
        >
          {label}
        </label>
      )}
      <input
        {...register(name, {
          required: { value: required, message: `${label}を入力してください` },
          minLength: {
            value: minLen,
            message: `${label}は${minLen}文字以上で入力してください`,
          },
          maxLength: {
            value: maxLen,
            message: `${label}は${maxLen}文字以内で入力してください`,
          },
          validate: (input) => {
            if (trigger && trigger.length > 0) {
              return (
                input === getValues(trigger) || `${getValueKey}が一致しません`
              );
            }
            return true;
          },
        })}
        type={type}
        min={min}
        max={max}
        step={step}
        className={
          inputClassProp
            ? inputClassProp
            : "input mb-3 outline outline-1 outline-gray-500"
        }
        style={inputWidth}
      />
    </div>
  );
};

export default Input;
