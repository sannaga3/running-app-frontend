const RadioButton = ({ name, selectable, selected, setSelected, register }) => {
  return (
    <div className="flex">
      {selectable.map((item) => (
        <div key={item.value} className="flex">
          <input
            name={name}
            {...register(name)}
            type="radio"
            checked={selected === item.value}
            value={item.value}
            onClick={(e) => setSelected(e.target.value)}
            className="mx-2 mb-1 bg-slate-400"
          />
          <label htmlFor={item.value} className=" text-black">
            {item.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioButton;
