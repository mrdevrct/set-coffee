"use client";

import { Provider } from "react-redux";
import store from "@/lib/redux/store/store";

const ClientProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ClientProvider;
