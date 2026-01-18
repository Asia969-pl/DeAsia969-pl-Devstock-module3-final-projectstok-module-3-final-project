"use client";

import { ReactNode, useRef } from "react";
import { SnackbarProvider, SnackbarKey } from "notistack";
import { GlobalContextProvider } from "../components/context/GlobalContext";
import { UserProvider } from "../components/context/UserContext";
import { SessionProvider } from "next-auth/react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface ProvidersProps {
  children: ReactNode;
  session?: any;
}

export default function Providers({ children, session }: ProvidersProps) {
  const notistackRef = useRef<SnackbarProvider | null>(null);

  const onClickDismiss = (key: SnackbarKey) => {
    notistackRef.current?.closeSnackbar(key);
  };

  return (
    <UserProvider>
      <GlobalContextProvider>
        <SnackbarProvider
          ref={notistackRef}
          maxSnack={3}
          autoHideDuration={3000}
          preventDuplicate
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          ContentProps={{
            sx: {
              width: "100vw",
              maxWidth: "100%",
              boxSizing: "border-box",
              borderRadius: "6px",
              padding: "12px 24px",
              margin: "8px 0",
            },
          }}
          action={(key) => (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => onClickDismiss(key)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        >
          {children}
        </SnackbarProvider>
      </GlobalContextProvider>
    </UserProvider>
  );
}
