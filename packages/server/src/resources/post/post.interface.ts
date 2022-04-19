import { Document } from 'mongoose';

export interface PostPayload {
    title: string;
    body: string;
}

interface Post extends Document, PostPayload {}

export default Post;
