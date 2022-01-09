import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import api from "../../../api";

const CommentComponents = ({ comment, onDelete }) => {
    const [commentAuthor, setCommentAuthor] = useState();
    useEffect(() => {
        api.users
            .getById(comment.userId)
            .then((data) => setCommentAuthor(data.name));
    }, [comment]);
    const dateFormat = (date) => {
        const secondsAgo = (Date.now() - date) / 1000;
        if (secondsAgo <= 60) {
            return " 1 минуту назад";
        } else if (secondsAgo <= 300) {
            return " 5 минут назад";
        } else if (secondsAgo <= 600) {
            return " 10 минут назад";
        } else if (secondsAgo / 86400 <= 1) {
            const hours =
                date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
            const minutes =
                date.getMinutes() < 10
                    ? `0${date.getMinutes()}`
                    : date.getMinutes();
            return ` ${hours} : ${minutes}`;
        } else if (secondsAgo / 86400 <= 365) {
            const day =
                date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
            const month =
                date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth();
            return ` ${day}-${month}`;
        } else {
            const day =
                date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
            const month =
                date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth();
            const year =
                date.getFullYear() < 10
                    ? `0${date.getFullYear()}`
                    : date.getFullYear();
            return ` ${day}-${month}-${year}`;
        }
    };

    const handleRemove = () => {
        onDelete(comment._id);
    };
    if (commentAuthor) {
        return (
            <>
                <img
                    src={`https://avatars.dicebear.com/api/avataaars/${(
                        Math.random() + 1
                    )
                        .toString(36)
                        .substring(7)}.svg`}
                    className="rounded-circle shadow-1-strong me-3"
                    alt="avatar"
                    width="65"
                    height="65"
                />
                <div className="flex-grow-1 flex-shrink-1">
                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <p className="mb-1 ">
                                {commentAuthor}
                                <span className="small">
                                    {dateFormat(
                                        new Date(Number(comment.created_at))
                                    )}
                                </span>
                            </p>
                            <button
                                className="btn btn-sm text-primary d-flex align-items-center"
                                onClick={handleRemove}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <p className="small mb-0">{comment.content}</p>
                    </div>
                </div>
            </>
        );
    } else {
        return "Loading...";
    }
};

CommentComponents.propTypes = {
    comment: PropTypes.obj,
    onDelete: PropTypes.func
};

export default CommentComponents;
