import { createContext } from "react";
import type { LocalizationContextType } from "../../common/Common";

const LocalizationContext = createContext<LocalizationContextType | undefined>(
  undefined
);

export default LocalizationContext;