import { React } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Icon from "../icon/icon";

export default function Modal({
  title,
  content,
  trigger,
  hasClose = false,
  primaryAction,
  primaryActionText = "Save",
  secondaryAction,
  secondaryActionText = "Close",
}) {
  return (
    <Popup trigger={trigger} modal>
      {(close) => (
        <div>
          {hasClose ? (
            <div className="text-clickable top-right p-2" onClick={close}>
              <Icon dataIcon="fa:times" />
            </div>
          ) : (
            ""
          )}
          <div className="header font-weight-bold">{title || "Modal"}</div>
          <div className="content">{content}</div>
          {primaryAction || secondaryAction ? (
            <div className="footer row m-0">
              {secondaryAction ? (
                <div
                  className="ml-auto btn btn-secondary"
                  onClick={() => {
                    if (secondaryAction()) close();
                  }}>
                  {secondaryActionText}
                </div>
              ) : (
                ""
              )}
              {primaryAction ? (
                <div
                  className="btn btn-primary"
                  onClick={() => {
                    if (primaryAction()) close();
                  }}>
                  {primaryActionText}
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </Popup>
  );
}
