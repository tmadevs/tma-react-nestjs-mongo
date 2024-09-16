import { useBackButton } from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import { To, useNavigate } from "react-router-dom";

export const useBack = (to: To) => {
  const navigate = useNavigate();
  const bb = useBackButton();

  useEffect(() => {
    const handleBack = () => {
      navigate(to);
    };

    if (bb) {
      bb.show();
      bb.on("click", handleBack);

      return () => {
        bb.off("click", handleBack);
      };
    }
  }, [bb]);
};
