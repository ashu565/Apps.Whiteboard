import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { WhiteboardApp } from "../WhiteboardApp";
import { UIKitViewSubmitInteractionContext } from "@rocket.chat/apps-engine/definition/uikit";
import { ModalsEnum } from "../enum/Modals";
import {
    storeInteractionRoomData,
    getInteractionRoomData,
} from "../persistence/roomInteraction";
import { storeBoardName } from "../persistence/boardInteraction";
import { storeAuthData } from "../persistence/authorization";
import { sendMessage } from "../lib/messages";
import { AppEnum } from "../enum/App";

//This class will handle all the view submit interactions
export class ExecuteViewSubmitHandler {
    constructor(
        private readonly app: WhiteboardApp,
        private readonly read: IRead,
        private readonly http: IHttp,
        private readonly persistence: IPersistence,
        private readonly modify: IModify
    ) {}

    public async run(context: UIKitViewSubmitInteractionContext) {
        const { user, view } = context.getInteractionData();

        try {
            switch (view.id) {
                case ModalsEnum.CREATE_BOARD_MODAL:
                    if (user.id && view.state) {
                        //Use the persistence functions to store the room data
                        const { roomId } = await getInteractionRoomData(
                            this.read.getPersistenceReader(),
                            user.id
                        );
                        if (roomId) {
                            const room = await this.read
                                .getRoomReader()
                                .getById(roomId);
                            const boardname =
                                view.state?.[ModalsEnum.BOARD_INPUT_BLOCK_ID]?.[
                                    ModalsEnum.BOARD_NAME_ACTION_ID
                                ];
                            //send message board created

                            if (room) {
                                await storeBoardName(
                                    this.persistence,
                                    user.id,
                                    roomId,
                                    boardname
                                );
                                await sendMessage(
                                    this.modify,
                                    room,
                                    user,
                                    `**${boardname}** whiteboard created! by @${user.username}`
                                );
                            }
                        }
                    }
                    break;

                case ModalsEnum.AUTH_MODAL:
                    if (user.id && view.state) {
                        //Use the persistence functions to store the room data
                        const { roomId } = await getInteractionRoomData(
                            this.read.getPersistenceReader(),
                            user.id
                        );
                        if (roomId) {
                            const room = await this.read
                                .getRoomReader()
                                .getById(roomId);
                            if (room) {
                                const Auth_Status = true;
                                await storeAuthData(
                                    this.persistence,
                                    user.id,
                                    roomId,
                                    Auth_Status
                                );

                                await sendMessage(
                                    this.modify,
                                    room,
                                    user,
                                    `**${AppEnum.APP_ID}** authorized! by @${user.username}`
                                );
                            }
                        }
                    }
                    break;

                default:
                    console.log("View Id not found");
                    break;
            }
        } catch (err) {
            console.log(err);
        }
    }
}
