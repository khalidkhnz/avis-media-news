"use client";

function useDetectOutsideClick(ref: any, callback: any, buttonRef?: any) {
  function handleClickOutside(event: any) {
    if (ref.current && !ref.current.contains(event.target)) {
      if (
        buttonRef &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        callback();
      } else if (!buttonRef) {
        callback();
      }
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}

export default useDetectOutsideClick;
