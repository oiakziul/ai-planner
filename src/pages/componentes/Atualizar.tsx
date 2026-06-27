import { RiRestartLine } from "react-icons/ri";
import clsx from "clsx";
export const Atualizar = () => {
  const handleReload = () => {
    window.location.reload();
  };
  
  const hover = clsx(
    "hover:scale-110 sm:hover:shadow-md rounded-full", 
    "hover:text-textHoverHeader"
  );

  return (
    <>
      <button onClick={handleReload} 
        className={clsx(hover)}
      >
        <RiRestartLine />
      </button>
    </>
  );
};
