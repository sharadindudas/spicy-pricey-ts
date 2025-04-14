import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/store/store.ts";
import "@/styles/index.css";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <Provider store={store}>
            <PersistGate
                loading={null}
                persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </BrowserRouter>
);

