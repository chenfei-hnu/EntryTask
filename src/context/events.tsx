import React from 'react';
import {
  eventsReducer,
  initialState,
  EventListAction,
  EventListState,
} from '@reducers/eventList';

type EventListContextProps = {
  state: EventListState;
  dispatch: React.Dispatch<EventListAction>;
};

const EventsContext = React.createContext<EventListContextProps>({
  state: initialState,
  dispatch: () => initialState,
});

export function EventProvider(props: React.PropsWithChildren<{}>) {
  const [state, dispatch] = React.useReducer(eventsReducer, initialState);
  return <EventsContext.Provider value={{ state, dispatch }} {...props} />;
}

export default function useEvents() {
  const context = React.useContext(EventsContext);
  if (!context) {
    throw new Error(`useEvent must be used within an EventProvider`);
  }
  return context;
}
