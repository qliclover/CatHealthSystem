import React from "react";

const layout = ({ children }) => {
    return (
        <div className="layout">
            <div className="content">
                {children}
            </div>
        </div>
    );
};

export default layout;