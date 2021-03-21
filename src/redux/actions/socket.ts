import { CREATE_ROOM, JOIN_ROOM, SocketActionTypes } from "../types";

const actions = {
    createRoom: (nickname: string): SocketActionTypes => ({
        type: CREATE_ROOM,
        payload: nickname,
    }),
    joinRoom: (id: string, nickname: string): SocketActionTypes => ({
        type: JOIN_ROOM,
        payload: {
            id,
            nickname,
        },
    }),
};

export default actions;
