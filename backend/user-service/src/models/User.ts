import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface User extends Document {
    email: string;
    username: string;
    password: string;
    role: 'user' | 'admin';
    comparePasswords(passwordConfirm: string): Promise<boolean>
}

const userSchema = new Schema<User>({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        min: 2,
        max: 50,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password should contain at least 8 characters"],
        min: 8,
        max: 128,
        select: false
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    // if password wasn't changed - skip
    if (!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12);
    next();
})

userSchema.methods.comparePasswords = async function (confirmPassword: string): Promise<boolean> {
    return await bcrypt.compare(confirmPassword, this.password);
}

export default mongoose.model<User>('User', userSchema);