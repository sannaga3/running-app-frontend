const FlashMessage = ({ flashMessage }) => {
  const successColor = "border-teal-500 text-teal-500";
  const errorColor = "border-red-700 text-red-700";
  const color =
    flashMessage?.type && flashMessage.type === "success"
      ? successColor
      : errorColor;

  return (
    <>
      {flashMessage?.message &&
        Object.keys(flashMessage.message).length > 0 && (
          <div className={`border-2 ${color} p-3 mb-4`}>
            <p>{flashMessage.message}</p>
          </div>
        )}
    </>
  );
};

export default FlashMessage;
