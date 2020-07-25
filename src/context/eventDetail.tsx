import React from 'react';
import {
    eventDetailReducer,
    initialState,
    EventDetailAction,
    EventDetailState,
} from '@reducers/eventDetail';

type EventDetailContextProps = {
    state: EventDetailState;
    dispatch: React.Dispatch<EventDetailAction>;
};

const EventDetailContext = React.createContext<EventDetailContextProps>({
    state: initialState,
    dispatch: () => initialState,
});

export function EventDetailProvider(props: React.PropsWithChildren<{}>) {
    const [state, dispatch] = React.useReducer(
        eventDetailReducer,
        initialState
    );
    return (
        <EventDetailContext.Provider value={{ state, dispatch }} {...props} />
    );
}

export default function useEventDetail() {
    const context = React.useContext(EventDetailContext);
    if (!context) {
        throw new Error(`useEvent must be used within an EventDetailProvider`);
    }
    return context;
}
