type Listener = () => void;

let listeners: Listener[] = [];

export const sessionChange = {
    subscribe: (listener: Listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter((l) => l !== listener);
        };
    },
    notify: () => {
        listeners.forEach((listener) => listener());
    },
};
