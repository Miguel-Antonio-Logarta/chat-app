import React from 'react'

type ToggleProps = {
    toggleState: boolean;
    toggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const Toggle = ({toggleState, toggle}: ToggleProps) => {
    return (
        <div className={`toggle-wrapper ${toggleState ? "" : "toggle-join" }`}>
            <button className="add-group-chat-toggle" onClick={() => toggle(!toggleState)}>
                <span className={toggleState ? "dark": "light"}>Create Group Chat</span>
                <span className={toggleState ? "light": "dark"}>Join Group Chat</span>
            </button>
        </div>
    )
}

export default Toggle