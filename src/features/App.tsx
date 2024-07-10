import { Container } from "semantic-ui-react";
import NavBar from "../app/layout/NavBar";
import { observer } from "mobx-react-lite";
import { Outlet, useLocation } from "react-router-dom";
import HomePage from "./home/HomePage";
import { ToastContainer } from "react-toastify";
import { useStore } from "../app/stores/store";
import { useEffect } from "react";
import LoadingComponent from "../app/layout/LoadingComponent";
import ModalContainer from "../app/common/modals/ModalContainer";

function App() {
  const location = useLocation();

  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore])

  if (!commonStore.appLoaded) return <LoadingComponent content="Loading activities..." />

  return (
    <>
      <ModalContainer />
      <ToastContainer position="bottom-right" theme="colored" />
      {location.pathname === '/' ? <HomePage /> : (
        <>
          <NavBar />
          <Container style={{ marginTop: "7em" }}>
            <Outlet />
          </Container>
        </>
      )}

    </>
  );
}

export default observer(App);
