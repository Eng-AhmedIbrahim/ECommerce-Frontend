import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useTranslation } from "react-i18next";
import "./SearchDialog.css";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const { t } = useTranslation();
const SearchDialog: React.FC<SearchDialogProps> = ({ open, onOpenChange }) => {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="search-overlay" />

        <AlertDialog.Content className="search-content">
          <div className="search-header">
            <input
              type="text"
              placeholder={t("Search")}
              className="search-input"
              autoFocus
            />
            <AlertDialog.Cancel asChild>
              <button className="close-btn" aria-label="Close">
                X
              </button>
            </AlertDialog.Cancel>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default SearchDialog;
