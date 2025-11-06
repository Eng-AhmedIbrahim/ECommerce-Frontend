import { createContext} from "react";
import type { ThemeContextType } from "../../common/Common";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export default ThemeContext;