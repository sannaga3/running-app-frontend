const flashMessage = ({ flashMessage }) => {
  const successColor = "teal-500";
  const errorColor = "red-700";
  const color =
    flashMessage && flashMessage.type === "success" ? successColor : errorColor;

  return (
    <>
      {flashMessage && Object.keys(flashMessage).length > 0 && (
        <div className={`border-2 border-${color} p-3 mb-4`}>
          <p className={`text-${color}`}>{flashMessage.message}</p>
        </div>
      )}
    </>
  );
};

export default flashMessage;
