import {
    IPersistence,
    IPersistenceRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    RocketChatAssociationModel,
    RocketChatAssociationRecord,
} from "@rocket.chat/apps-engine/definition/metadata";

//functions needed to persist board data while modal and other UI interactions

export const storeBoardRecord = async (
    persistence: IPersistence,
    boardId: string,
    boardData: any,
    messageId:string,
    cover: string,
    title: string
): Promise<void> => {
    const association = new RocketChatAssociationRecord(
        RocketChatAssociationModel.USER,
        `${boardId}#BoardName`
    );
    await persistence.updateByAssociation(
        association,
        {
            id: boardId,
            boardData:{
                elements: boardData.elements,
                appState: boardData.appState,
                files: boardData.files,
            },
            messageId,
            cover,
            title,
        },
        true
    );
};

export const getBoardRecord = async (
    persistenceRead: IPersistenceRead,
    boardId: string
): Promise<any> => {
    const association = new RocketChatAssociationRecord(
        RocketChatAssociationModel.USER,
        `${boardId}#BoardName`
    );
    const result = (await persistenceRead.readByAssociation(
        association
    )) as Array<any>;
    return result && result.length ? result[0] : null;
};
