  const useGenerateRandomNumber = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
  };

  export default useGenerateRandomNumber;