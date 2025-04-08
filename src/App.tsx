import { Route, Routes } from "react-router";
import Home from "@/pages/Home";
import Header from "@/components/common/Header";

const App = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </>
    );
};

export default App;
