'use client'
import { fetchDefaultImages, sendRequest } from '@/utils/api';
import { Box, TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)
interface IProps {
    comments: ITrackComment[];
    track: ITrackTop | null;
}
const CommentTrack = (props: IProps) => {
    const router = useRouter();
    const { comments, track } = props;
    const [yourComment, setYourComment] = useState("");
    const { data: session } = useSession();
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secondsRemainder = Math.round(seconds) % 60
        const paddedSeconds = `0${secondsRemainder}`.slice(-2)
        return `${minutes}:${paddedSeconds}`
    }
    const handleSubmit = async () => {
        const res = await sendRequest<IBackendRes<ITrackComment>>({
            url: `http://localhost:8000/api/v1/comments`,
            method: "POST",
            body: {
                content: yourComment,
                moment: 10,
                track: track?._id
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            },
        })
        if (res.data) {
            setYourComment("");
            router.refresh()
        }
    }
    return (
        <div>
            <div style={{ marginTop: "50px", marginBottom: "25px" }}>
                {session?.user &&
                    <TextField
                        value={yourComment}
                        onChange={(e) => setYourComment(e.target.value)}
                        fullWidth label="Comments" variant="standard"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit()
                            }
                        }}
                    />
                }
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
                <div className='left' style={{ width: "190px" }}>
                    <img
                        style={{
                            height: 150, width: 150,
                        }}
                        src={fetchDefaultImages(track?.uploader?.type!)}
                    />
                    <div>{track?.uploader?.email}</div>
                </div>
                <div className='right' style={{ width: "calc(100% - 200px)" }}>
                    {comments?.map(comment => {
                        return (
                            <Box key={comment._id} sx={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
                                <Box sx={{ display: "flex", gap: "10px", marginBottom: "25px", alignItems: "center" }}>
                                    <img
                                        style={{
                                            height: 40, width: 40,
                                        }}
                                        src={fetchDefaultImages(comment.user.type)}
                                    />
                                    <div>
                                        <div style={{ fontSize: "13px" }}>{comment?.user?.name ?? comment?.user?.email} at {formatTime(comment.moment)}</div>
                                        <div>
                                            {comment.content}
                                        </div>
                                    </div>
                                </Box>
                                <div style={{ fontSize: "12px", color: "#999" }}>
                                    {dayjs(comment.createdAt).fromNow()}
                                </div>
                            </Box>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
export default CommentTrack;