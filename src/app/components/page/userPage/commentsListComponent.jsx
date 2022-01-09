import React, { useState, useEffect } from "react";
import CommentComponents from "./commentComponents";
import api from "../../../api";
import NewCommentComponent from "./newCommentComponent";
import PropTypes from "prop-types";

const CommentsListComponent = ({ user }) => {
    const [comments, setComments] = useState();
    const [users, setUsers] = useState();
    const [newComment, setNewComment] = useState({
        _id: "",
        userId: "",
        pageId: user._id,
        content: "",
        created_at: ""
    });
    useEffect(() => {
        api.comments.fetchCommentsForUser(user._id).then((data) => {
            setComments(data);
        });
    }, [user]);
    useEffect(() => {
        api.users.fetchAll().then((data) =>
            setUsers(
                data.map((i) => {
                    return {
                        name: i.name,
                        _id: i._id
                    };
                })
            )
        );
    }, [users]);
    const commentRemove = (id) => {
        api.comments.remove(id);
        api.comments.fetchCommentsForUser(user._id).then((data) => {
            setComments(data);
        });
    };
    const commentAdd = () => {
        api.comments.add(newComment);
        api.comments.fetchCommentsForUser(user._id).then((data) => {
            setComments(data);
        });
        setNewComment({
            _id: "",
            userId: "",
            pageId: user._id,
            content: "",
            created_at: ""
        });
    };
    const handleChange = (target) => {
        setNewComment((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };
    const isValid = newComment.userId !== "" && newComment.content !== "";
    return (
        <>
            <div className="card mb-2">
                <div className="card-body">
                    <NewCommentComponent
                        options={users}
                        onChange={handleChange}
                        value={newComment.userId}
                        content={newComment.content}
                    />
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={commentAdd}
                            disabled={!isValid}
                        >
                            Опубликовать
                        </button>
                    </div>
                </div>
            </div>
            {comments && Object.keys(comments).length !== 0 ? (
                <div className="card mb-3">
                    <div className="card-body ">
                        <h2>Comments</h2>
                        <hr />
                        {comments
                            .sort((a, b) => a - b)
                            .map((comment) => {
                                return (
                                    <div
                                        className="bg-light card-body  mb-3"
                                        key={comment._id}
                                    >
                                        <div className="row">
                                            <div className="col">
                                                <div className="d-flex flex-start ">
                                                    <CommentComponents
                                                        comment={comment}
                                                        onDelete={commentRemove}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            ) : (
                ""
            )}
        </>
    );
};
CommentsListComponent.propTypes = {
    user: PropTypes.obj,
    text: PropTypes.string
};

export default CommentsListComponent;
