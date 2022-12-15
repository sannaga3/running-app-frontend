const input = ({
  label,
  name,
  type,
  register,
  required = false,
  minLen,
  maxLen,
  getValues,
  getValueKey,
  trigger = null,
  labelSize = "200px",
  inputSize = "200px",
}) => {
  const labelWidth = { width: labelSize };
  const inputWidth = { width: inputSize };

  return (
    <div className="flex items-center space-y-3">
      <label className="text-lg mt-0.5" style={labelWidth}>
        {label}
      </label>
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
        className={`input mb-3`}
        style={inputWidth}
      />
    </div>
  );
};

export default input;
