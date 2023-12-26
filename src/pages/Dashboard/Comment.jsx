import { supabase } from "../../supabaseClient";
import { useEffect, useState } from "react";
import "../../css/comment.css";
import Header from "../Header";

const Comment = ({ token }) => {
    const metadata = [
        { key: "full_name", value: token.user.user_metadata.full_name },
        { key: "email", value: token.user.email },
    ];

    const [comments, setComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 5;

    useEffect(() => {
        const fetchComment = async () => {
            try {
                const { data: commentData, error } = await supabase
                    .from('comment')
                    .select(`comment, rating, user_id, created_at, user:user_id (username)`)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching from Supabase:', error);
                } else {
                    setComments(commentData);
                }
            } catch (error) {
                console.error('Error fetching comment from Supabase:', error);
            }
        };

        fetchComment();
    }, []);

    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="commentPage">
            <div className="comment-wrapper">
                <div className="overlap">
                    <div className="overlap-group">
                        <Header token={metadata} />
                    </div>
                    <div className="comment-title">Comments</div>
                    <div className="comment">
                        {currentComments.map((comment) => (
                            <div key={comment.id} className="comment-container">
                                <div className="user-info">
                                    <div className="username">{comment.user.username}&nbsp;</div>
                                    <div className="userid">({comment.user_id})</div>
                                </div>
                                <div className="rating">
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                color: index < comment.rating ? '#ff8f00' : '#ffffff',
                                            }}
                                        >
                                            &#9733;
                                        </span>
                                    ))}
                                </div>
                                <div className="created-at">
                                    <div>{new Date(comment.created_at).toLocaleString()}</div>
                                </div>
                                <div className="comment-box">
                                    <div>{comment.comment}</div>
                                </div>
                            </div>
                        ))}

                        <div className="pagination">
                            {Array.from({ length: Math.ceil(comments.length / commentsPerPage) }, (_, index) => (
                                <button
                                    key={index + 1}
                                    className={currentPage === index + 1 ? 'active' : ''}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Comment;
