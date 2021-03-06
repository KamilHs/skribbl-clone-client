import { AnyAction, Middleware, MiddlewareAPI, Dispatch } from "redux";
import { push } from "connected-react-router";
import socketIOClient from "socket.io-client";

import { gameActions, homeActions, lobbyActions } from "../redux/actions";
import { RootState } from "../redux/store";
import {
    AllActionTypes,
    CREATE_ROOM,
    IMessage,
    IPlayerData,
    JOIN_ROOM,
    SEND_MESSAGE,
    START_GAME,
} from "../redux/types";
import {
    isHomeError,
    GET_PLAYERS_DATA,
    IHomeResponse,
    GET_MESSAGE,
} from "../socket/types";
import { LOBBY_ROUTES } from "../modules/Lobby";
import { GAME_ROUTES } from "../modules/Game";

const handleCreateAndJoinRoom = (
    storeApi: MiddlewareAPI<Dispatch<AnyAction>, RootState>,
    res: IHomeResponse
) => {
    if (isHomeError(res)) {
        homeActions.setError(res.message);
    } else {
        storeApi.dispatch(lobbyActions.setRoomId(res.roomId));
        storeApi.dispatch(push(`${LOBBY_ROUTES.MAIN}/${res.roomId}`));
    }
};

export const socketMiddleware = (url: string) => {
    const socket = socketIOClient(url, { transports: ["websocket"] });

    socket.on("connect", () => {
        console.log("connected");
    });

    const middleware: Middleware<{}, RootState> = (storeApi) => {
        socket.on(GET_PLAYERS_DATA, (data: IPlayerData[] | null) =>
            storeApi.dispatch(lobbyActions.setPlayerData(data))
        );
        socket.on(START_GAME, (roomId: string) =>
            storeApi.dispatch(push(`${GAME_ROUTES.MAIN}/${roomId}`))
        );
        socket.on(GET_MESSAGE, (message: IMessage) =>
            storeApi.dispatch(gameActions.setMessage(message))
        );

        return (next) => (action: AllActionTypes) => {
            switch (action.type) {
                case CREATE_ROOM:
                    socket.emit(CREATE_ROOM, { nickname: action.payload });
                    socket.on(CREATE_ROOM, (res: IHomeResponse) =>
                        handleCreateAndJoinRoom(storeApi, res)
                    );
                    break;
                case JOIN_ROOM:
                    socket.emit(JOIN_ROOM, action.payload);
                    socket.on(JOIN_ROOM, (res: IHomeResponse) =>
                        handleCreateAndJoinRoom(storeApi, res)
                    );
                    break;
                case START_GAME:
                    socket.emit(START_GAME, { roomId: action.payload });
                    break;
                case SEND_MESSAGE:
                    socket.emit(SEND_MESSAGE, { message: action.payload });
                    break;
                default:
                    next(action);
            }
        };
    };

    return middleware;
};
