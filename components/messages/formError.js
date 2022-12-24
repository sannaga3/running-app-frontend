const formError = ({ errors }) => {
  const errorArr = errors && Object.entries(errors);

  return (
    <>
      {errorArr.length > 0 && (
        <div className="border-2 border-red-700 p-3 mb-4">
          {errorArr.map((error, index) => {
            return (
              <li className="text-red-700" key={index}>
                {error[1].message}
              </li>
            );
          })}
        </div>
      )}
    </>
  );
};

export default formError;
