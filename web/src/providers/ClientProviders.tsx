// src/providers/ClientProviders.tsx
"use client";

import { AuthProvider } from "@/context/AuthContext";
import { SessionProvider } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ClientProvidersProps {
  children: React.ReactNode;
  session: any; // Add session prop
}

export function ClientProviders({ children, session }: ClientProvidersProps) {
  const auth = session?.user;
  const codePanelRef = useRef<any>(null);
  const initialProject = "express";
  const [isLoading, setIsLoading] = useState(false);
  const [buildCompleted, setBuildCompleted] = useState(false);
  const [initialFiles, setInitialFiles] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [status, setStatus] = useState<any[]>([
    {
      type: "INFO",
      message: "Connected to the server",
    },
  ]);

  return (
    <SessionProvider session={session}>
      <AuthProvider>
        {children}
        <ToastContainer />
      </AuthProvider>
    </SessionProvider>
  );
}
