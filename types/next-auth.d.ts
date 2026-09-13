import { DefaultSession } from "next-auth"

export type AppRole = "PELAPOR" | "PETUGAS" | "PIMPINAN";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: AppRole;
    } & DefaultSession["user"];
  }
  
  interface User {
    id: string;
    role: AppRole;
  }
}
