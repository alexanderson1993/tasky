import React from "react";
import {
  useDisclosure,
  AlertDialog,
  Scale,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Input,
} from "@chakra-ui/core";

interface DialogI {
  header: string;
  body?: string;
  defaultValue?: string;
  type: "alert" | "confirm" | "prompt";
}
const DialogContext = React.createContext<
  ({ header, body, defaultValue, type }: DialogI) => Promise<boolean | string>
>(async () => false);

const Dialog: React.FC = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [header, setHeader] = React.useState("");
  const [body, setBody] = React.useState("");
  const [type, setType] = React.useState<"alert" | "confirm" | "prompt">(
    "alert"
  );
  const [input, setInput] = React.useState("");

  const btnRef = React.useRef();
  const cancelRef = React.useRef();

  const resolveRef = React.useRef<(tf: boolean | string) => void>();
  const openConfirm = React.useCallback(
    ({ header, body, defaultValue, type }: DialogI) => {
      if (isOpen) return;
      if (resolveRef.current) {
        resolveRef.current(false);
      }
      onOpen();
      setHeader(header);
      setBody(body || "");
      setType(type);
      setInput(defaultValue || "");

      return new Promise<boolean | string>((resolve) => {
        resolveRef.current = resolve;
      });
    },
    [isOpen, onOpen]
  );

  const [inputEl, setInputEl] = React.useState(null);

  const inputRef = React.useCallback((node) => {
    if (node !== null) {
      setInputEl(node);
    }
  }, []);
  React.useEffect(() => {
    if (isOpen && type === "prompt" && inputEl) {
      inputEl.setSelectionRange(0, inputEl.value.length);
    }
  }, [inputEl, isOpen, type]);

  React.useEffect(() => {
    function handleReturn(e) {
      if (e.key === "Enter") {
        if (type === "confirm") {
          resolveRef.current(true);
        } else if (type === "prompt") {
          resolveRef.current(input);
        } else {
          resolveRef.current(false);
        }
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleReturn);
      return () => document.removeEventListener("keydown", handleReturn);
    }
  }, [isOpen, input, type, onClose]);

  return (
    <DialogContext.Provider value={openConfirm}>
      {children}
      {/* @ts-ignore */}
      <Scale in={isOpen}>
        {/* @ts-ignore */}
        {(styles) => (
          <AlertDialog
            leastDestructiveRef={type === "prompt" ? undefined : btnRef}
            finalFocusRef={cancelRef}
            onClose={() => {
              resolveRef.current?.(false);
              onClose();
            }}
            isOpen={true}
            closeOnOverlayClick={false}
          >
            <AlertDialogOverlay opacity={styles.opacity} />
            <AlertDialogContent {...styles}>
              <AlertDialogHeader>{header}</AlertDialogHeader>
              <AlertDialogBody>
                {type === "prompt" ? (
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                ) : (
                  body
                )}
              </AlertDialogBody>
              <AlertDialogFooter>
                {type !== "alert" && (
                  <Button
                    ref={cancelRef}
                    onClick={() => {
                      resolveRef.current(false);
                      onClose();
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  // @ts-ignore
                  autoFocus={type !== "prompt"}
                  variantColor="blue"
                  ml={3}
                  onClick={() => {
                    resolveRef.current(type === "prompt" ? input : true);
                    onClose();
                  }}
                >
                  OK
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </Scale>
    </DialogContext.Provider>
  );
};

export function useConfirm() {
  const dialog = React.useContext(DialogContext);

  return ({ header, body }) => dialog({ header, body, type: "confirm" });
}
export function usePrompt() {
  const dialog = React.useContext(DialogContext);

  return ({
    header,
    body,
    defaultValue,
  }: {
    header: string;
    body?: string;
    defaultValue?: string;
  }) => dialog({ header, body, defaultValue, type: "prompt" });
}
export function useAlert() {
  const dialog = React.useContext(DialogContext);
  return ({ header, body }) => dialog({ header, body, type: "alert" });
}
export default Dialog;
