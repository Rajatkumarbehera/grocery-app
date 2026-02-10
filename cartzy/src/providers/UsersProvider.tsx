"use client";

import { store } from "@/redux/store";
import React from "react";
import { Provider } from "react-redux";

type UserProviderProps = {
  children: React.ReactNode;
};

export default function UsersProvider({ children }: UserProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
