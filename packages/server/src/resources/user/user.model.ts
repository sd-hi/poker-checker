import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../../resources/user/user.interface';

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true, // Users will be uniquely keyed by email address
            trim: true, // Trim whitespace (protection if user enters email with whitespace)
        },

        name: {
            type: String,
            required: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

UserSchema.pre<User>('save', async function (next) {
    // Make sure password gets hashed before being stored in DB
    if (!this.isModified('password')) {
        return next();
    }

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

UserSchema.methods.isValidPassword = async function (
    password: string
): Promise<Error | boolean> {
    return await bcrypt.compare(password, this.password);
};

export default model<User>('User', UserSchema);
