const FormError = ({ errorMessage }: { errorMessage: string | undefined }) => {
  return (
    <span className="text-red-500 text-xs italic font-semibold">
      {errorMessage}
    </span>
  );
};
export default FormError;