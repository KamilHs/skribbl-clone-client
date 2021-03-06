import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";

import { HomeRoutes } from "./modules/Home";
import { LobbyRoutes } from "./modules/Lobby";
import store, { history } from "./redux/store";
import { Route } from "react-router-dom";
import { GameRoutes } from "./modules/Game";

const App: React.FC = () => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Route>
                <GameRoutes />
                <LobbyRoutes />
                <HomeRoutes />
            </Route>
        </ConnectedRouter>
    </Provider>
);

export default App;
